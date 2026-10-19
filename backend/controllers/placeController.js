const fs = require('fs');
const path = require('path');
const pool = require('../config/db');
const { haversineDistanceKm } = require('../utils/haversine');
const { generateItinerary } = require('../utils/itinerary');
require('dotenv').config();

const REFERENCE_LAT = parseFloat(process.env.REFERENCE_LAT || '6.7296579');
const REFERENCE_LNG = parseFloat(process.env.REFERENCE_LNG || '79.9294361');
const MAX_RADIUS_KM = parseFloat(process.env.MAX_RADIUS_KM || '25');

function withDistance(place) {
  const distanceKm = haversineDistanceKm(
    REFERENCE_LAT,
    REFERENCE_LNG,
    Number(place.latitude),
    Number(place.longitude)
  );

  return { ...place, distance_km: Number(distanceKm.toFixed(1)) };
}

function removeUploadedFile(relativePath) {
  if (!relativePath || !relativePath.startsWith('/uploads/')) return;

  const absolute = path.join(
    __dirname,
    '..',
    relativePath.replace('/uploads/', 'uploads/')
  );

  fs.unlink(absolute, () => {});
}

function cleanNewFiles(req) {
  Object.values(req.files || {})
    .flat()
    .forEach((file) => fs.unlink(file.path, () => {}));
}

function uploadsAreImages(req) {
  return Object.values(req.files || {})
    .flat()
    .every((file) => {
      const fd = fs.openSync(file.path, 'r');
      const signature = Buffer.alloc(12);

      fs.readSync(fd, signature, 0, 12, 0);
      fs.closeSync(fd);

      return (
        signature.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])) ||
        signature
          .subarray(0, 8)
          .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) ||
        (signature.toString('ascii', 0, 4) === 'RIFF' &&
          signature.toString('ascii', 8, 12) === 'WEBP')
      );
    });
}

function validatePlace(body) {
  const {
    name,
    description,
    category_id,
    latitude,
    longitude,
    avg_visit_minutes,
  } = body;

  if (
    !name?.trim() ||
    !description?.trim() ||
    !/^\d+$/.test(String(category_id || ''))
  ) {
    return 'Name, description and category are required.';
  }

  if (
    latitude === '' ||
    longitude === '' ||
    latitude == null ||
    longitude == null ||
    !Number.isFinite(Number(latitude)) ||
    !Number.isFinite(Number(longitude)) ||
    Number(latitude) < -90 ||
    Number(latitude) > 90 ||
    Number(longitude) < -180 ||
    Number(longitude) > 180
  ) {
    return 'Enter valid latitude and longitude coordinates.';
  }

  const distance = haversineDistanceKm(
    REFERENCE_LAT,
    REFERENCE_LNG,
    Number(latitude),
    Number(longitude)
  );

  if (distance > MAX_RADIUS_KM) {
    return `This place is ${distance.toFixed(
      1
    )} km away. Places must be within ${MAX_RADIUS_KM} km of Panadura.`;
  }

  if (
    avg_visit_minutes !== undefined &&
    (!Number.isInteger(Number(avg_visit_minutes)) ||
      Number(avg_visit_minutes) < 1)
  ) {
    return 'Average visit duration must be a positive number of minutes.';
  }

  const {
    opening_time,
    closing_time,
    hours_unavailable,
    is_24_hours,
  } = body;

  if (
    is_24_hours !== 'true' &&
    is_24_hours !== true &&
    hours_unavailable !== 'true' &&
    hours_unavailable !== true &&
    Boolean(opening_time) !== Boolean(closing_time)
  ) {
    return 'Enter both opening and closing times, or mark hours unavailable.';
  }

  return null;
}

async function getAllPlaces(req, res) {
  try {
    const { search, category } = req.query;

    let sql = `
      SELECT p.*, c.name AS category_name
      FROM places p
      JOIN categories c ON c.id = p.category_id
      WHERE 1 = 1
    `;

    const params = [];

    if (search) {
      sql +=
        ' AND (p.name LIKE ? OR p.description LIKE ? OR p.short_description LIKE ?)';

      const like = `%${search}%`;
      params.push(like, like, like);
    }

    if (category) {
      const categoryIds = String(category)
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);

      if (categoryIds.length > 0) {
        sql += ` AND c.name IN (${categoryIds
          .map(() => '?')
          .join(',')})`;

        params.push(...categoryIds);
      }
    }

    sql += ' ORDER BY p.name ASC';

    const [rows] = await pool.query(sql, params);
    res.json(rows.map(withDistance));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load places.' });
  }
}

async function getPlacesForMap(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.name, p.category_id, c.name AS category_name,
              p.short_description, p.description, p.latitude,
              p.longitude, p.primary_image
       FROM places p
       JOIN categories c ON c.id = p.category_id
       ORDER BY p.name ASC`
    );

    res.json(rows.map(withDistance));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load map data.' });
  }
}

async function getPlaceById(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.name AS category_name
       FROM places p
       JOIN categories c ON c.id = p.category_id
       WHERE p.id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Place not found.' });
    }

    res.json(withDistance(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load place details.' });
  }
}

async function createPlace(req, res) {
  try {
    const {
      name,
      category_id,
      description,
      short_description,
      latitude,
      longitude,
      opening_time,
      closing_time,
      hours_unavailable,
      is_24_hours,
      travel_tips,
      avg_visit_minutes,
    } = req.body;

    const validationError =
      validatePlace(req.body) ||
      (!uploadsAreImages(req)
        ? 'Upload a valid JPG, PNG or WEBP image.'
        : null);

    if (validationError) {
      cleanNewFiles(req);
      return res.status(400).json({ message: validationError });
    }

    const files = req.files || {};

    const primaryImage = files.primary_image
      ? `/uploads/${files.primary_image[0].filename}`
      : null;

    const image1 = files.image_1
      ? `/uploads/${files.image_1[0].filename}`
      : null;

    const image2 = files.image_2
      ? `/uploads/${files.image_2[0].filename}`
      : null;

    const [result] = await pool.query(
      `INSERT INTO places
        (name, category_id, description, short_description,
         latitude, longitude, opening_time, closing_time,
         hours_unavailable, is_24_hours, travel_tips,
         avg_visit_minutes, primary_image, image_1, image_2)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        category_id,
        description,
        short_description || null,
        latitude,
        longitude,
        is_24_hours === 'true' || is_24_hours === true
          ? null
          : opening_time || null,
        is_24_hours === 'true' || is_24_hours === true
          ? null
          : closing_time || null,
        hours_unavailable === 'true' || hours_unavailable === true ? 1 : 0,
        is_24_hours === 'true' || is_24_hours === true ? 1 : 0,
        travel_tips || null,
        avg_visit_minutes || 90,
        primaryImage,
        image1,
        image2,
      ]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Place created successfully.',
    });
  } catch (err) {
    cleanNewFiles(req);
    console.error(err);

    const invalidCategory = err.code === 'ER_NO_REFERENCED_ROW_2';

    res.status(invalidCategory ? 400 : 500).json({
      message: invalidCategory
        ? 'Select a valid category.'
        : 'Failed to create place.',
    });
  }
}

async function updatePlace(req, res) {
  try {
    const { id } = req.params;

    const [existingRows] = await pool.query(
      'SELECT * FROM places WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      cleanNewFiles(req);
      return res.status(404).json({ message: 'Place not found.' });
    }

    const existing = existingRows[0];

    const {
      name,
      category_id,
      description,
      short_description,
      latitude,
      longitude,
      opening_time,
      closing_time,
      hours_unavailable,
      is_24_hours,
      travel_tips,
      avg_visit_minutes,
    } = req.body;

    const validationError =
      validatePlace(req.body) ||
      (!uploadsAreImages(req)
        ? 'Upload a valid JPG, PNG or WEBP image.'
        : null);

    if (validationError) {
      cleanNewFiles(req);
      return res.status(400).json({ message: validationError });
    }

    const files = req.files || {};

    const primaryImage = files.primary_image
      ? `/uploads/${files.primary_image[0].filename}`
      : existing.primary_image;

    const image1 = files.image_1
      ? `/uploads/${files.image_1[0].filename}`
      : existing.image_1;

    const image2 = files.image_2
      ? `/uploads/${files.image_2[0].filename}`
      : existing.image_2;

    await pool.query(
      `UPDATE places SET
        name = ?, category_id = ?, description = ?,
        short_description = ?, latitude = ?, longitude = ?,
        opening_time = ?, closing_time = ?,
        hours_unavailable = ?, is_24_hours = ?,
        travel_tips = ?, avg_visit_minutes = ?,
        primary_image = ?, image_1 = ?, image_2 = ?
       WHERE id = ?`,
      [
        name,
        category_id,
        description,
        short_description || null,
        latitude,
        longitude,
        is_24_hours === 'true' || is_24_hours === true
          ? null
          : opening_time || null,
        is_24_hours === 'true' || is_24_hours === true
          ? null
          : closing_time || null,
        hours_unavailable === 'true' || hours_unavailable === true ? 1 : 0,
        is_24_hours === 'true' || is_24_hours === true ? 1 : 0,
        travel_tips || null,
        avg_visit_minutes || 90,
        primaryImage,
        image1,
        image2,
        id,
      ]
    );

    if (files.primary_image) removeUploadedFile(existing.primary_image);
    if (files.image_1) removeUploadedFile(existing.image_1);
    if (files.image_2) removeUploadedFile(existing.image_2);

    res.json({ message: 'Place updated successfully.' });
  } catch (err) {
    cleanNewFiles(req);
    console.error(err);

    const invalidCategory = err.code === 'ER_NO_REFERENCED_ROW_2';

    res.status(invalidCategory ? 400 : 500).json({
      message: invalidCategory
        ? 'Select a valid category.'
        : 'Failed to update place.',
    });
  }
}

async function deletePlace(req, res) {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      'SELECT * FROM places WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Place not found.' });
    }

    await pool.query('DELETE FROM places WHERE id = ?', [id]);

    removeUploadedFile(rows[0].primary_image);
    removeUploadedFile(rows[0].image_1);
    removeUploadedFile(rows[0].image_2);

    res.json({ message: 'Place deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete place.' });
  }
}

async function buildItinerary(req, res) {
  try {
    const { placeIds } = req.body;

    if (
      !Array.isArray(placeIds) ||
      placeIds.length === 0 ||
      placeIds.some(
        (id) => !Number.isInteger(Number(id)) || Number(id) < 1
      )
    ) {
      return res.status(400).json({
        message: 'Select valid places to build an itinerary.',
      });
    }

    const [rows] = await pool.query(
      `SELECT p.*, c.name AS category_name
       FROM places p
       JOIN categories c ON c.id = p.category_id
       WHERE p.id IN (${placeIds.map(() => '?').join(',')})`,
      placeIds
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'None of the selected places could be found.',
      });
    }

    const result = generateItinerary(
      rows.map((place) => ({
        ...place,
        latitude: Number(place.latitude),
        longitude: Number(place.longitude),
      })),
      REFERENCE_LAT,
      REFERENCE_LNG,
      MAX_RADIUS_KM
    );

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to generate itinerary.' });
  }
}

module.exports = {
  getAllPlaces,
  getPlacesForMap,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  buildItinerary,
};