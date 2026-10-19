import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchCategories, fetchPlaceById, createPlace, updatePlace, resolveImageUrl } from '../api/api';
import Loader from '../components/Loader';
import ErrorBanner from '../components/ErrorBanner';

const emptyForm = {
  name: '',
  category_id: '',
  description: '',
  short_description: '',
  latitude: '',
  longitude: '',
  opening_time: '',
  closing_time: '',
  hours_unavailable: false,
  is_24_hours: false,
  travel_tips: '',
  avg_visit_minutes: 90,
};

export default function AdminPlaceForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [existingImages, setExistingImages] = useState({ primary_image: null, image_1: null, image_2: null });
  const [files, setFiles] = useState({ primary_image: null, image_1: null, image_2: null });
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEditing) return;
    fetchPlaceById(id)
      .then((place) => {
        setForm({
          name: place.name,
          category_id: place.category_id,
          description: place.description,
          short_description: place.short_description || '',
          latitude: place.latitude,
          longitude: place.longitude,
          opening_time: place.opening_time ? place.opening_time.slice(0, 5) : '',
          closing_time: place.closing_time ? place.closing_time.slice(0, 5) : '',
          hours_unavailable: Boolean(place.hours_unavailable),
          is_24_hours: Boolean(place.is_24_hours),
          travel_tips: place.travel_tips || '',
          avg_visit_minutes: place.avg_visit_minutes || 90,
        });
        setExistingImages({
          primary_image: place.primary_image,
          image_1: place.image_1,
          image_2: place.image_2,
        });
      })
      .catch(() => setError('Could not load this place.'))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleFileChange(field, fileList) {
    setFiles((prev) => ({ ...prev, [field]: fileList[0] || null }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    Object.entries(files).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });

    try {
      if (isEditing) {
        await updatePlace(id, formData);
      } else {
        await createPlace(formData);
      }
      navigate('/admin/dashboard', {
        replace: true,
        state: { notice: `"${form.name.trim()}" ${isEditing ? 'updated' : 'added'} successfully.` },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save this place. Please check the fields and try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loader label="Loading place..." />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <Link to="/admin/dashboard" className="inline-flex items-center gap-1.5 text-sm font-medium text-ocean-600 hover:text-ocean-800 mb-6">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to dashboard
      </Link>

      <h1 className="section-heading">{isEditing ? 'Edit Place' : 'Add New Place'}</h1>

      <form onSubmit={handleSubmit} className="mt-8 card p-6 md:p-8 space-y-6">
        {error && <ErrorBanner message={error} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="label">Place Name</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Category</label>
            <select
              className="input"
              value={form.category_id}
              onChange={(e) => updateField('category_id', e.target.value)}
              required
            >
              <option value="" disabled>Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Average visit duration (minutes)</label>
            <input
              type="number"
              min="15"
              step="15"
              className="input"
              value={form.avg_visit_minutes}
              onChange={(e) => updateField('avg_visit_minutes', e.target.value)}
            />
          </div>

          <div>
            <label className="label">Latitude</label>
            <input
              type="number"
              step="any"
              className="input"
              value={form.latitude}
              onChange={(e) => updateField('latitude', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Longitude</label>
            <input
              type="number"
              step="any"
              className="input"
              value={form.longitude}
              onChange={(e) => updateField('longitude', e.target.value)}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="label">Short description (used on place cards)</label>
            <input
              className="input"
              maxLength={255}
              value={form.short_description}
              onChange={(e) => updateField('short_description', e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="label">Full description</label>
            <textarea
              className="input"
              rows={5}
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="label">Travel tips</label>
            <textarea
              className="input"
              rows={3}
              value={form.travel_tips}
              onChange={(e) => updateField('travel_tips', e.target.value)}
            />
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-6">
  <label className="flex items-center gap-2 text-sm text-ocean-700">
    <input
      type="checkbox"
      checked={form.is_24_hours}
      onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          is_24_hours: e.target.checked,
          hours_unavailable: e.target.checked ? false : prev.hours_unavailable,
        }))
      }
      className="w-4 h-4 rounded border-ocean-300 text-ocean-500 focus:ring-ocean-400"
    />
    Open 24 hours (e.g. beach, lake, waterfall)
  </label>

  <label className="flex items-center gap-2 text-sm text-ocean-700">
    <input
      type="checkbox"
      checked={form.hours_unavailable}
      disabled={form.is_24_hours}
      onChange={(e) => updateField('hours_unavailable', e.target.checked)}
      className="w-4 h-4 rounded border-ocean-300 text-ocean-500 focus:ring-ocean-400 disabled:opacity-50"
    />
    Opening/closing hours not available
  </label>
</div>

{!form.hours_unavailable && !form.is_24_hours && (
  <>
    <div>
      <label className="label">Opening time</label>
      <input type="time" className="input" value={form.opening_time} onChange={(e) => updateField('opening_time', e.target.value)} />
    </div>
    <div>
      <label className="label">Closing time</label>
      <input type="time" className="input" value={form.closing_time} onChange={(e) => updateField('closing_time', e.target.value)} />
    </div>
  </>
)}
</div>

        <hr className="border-ocean-100" />

        <div>
          <h3 className="font-display font-semibold text-ocean-900 mb-1">Images</h3>
          <p className="text-sm text-ocean-500 mb-4">
            Add up to 3 images. The primary image appears on place cards; the two additional
            images appear in the details-page gallery.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { field: 'primary_image', label: 'Primary image' },
              { field: 'image_1', label: 'Additional image 1' },
              { field: 'image_2', label: 'Additional image 2' },
            ].map(({ field, label }) => (
              <div key={field}>
                <label className="label">{label}</label>
                <div className="aspect-video rounded-xl bg-ocean-50 border border-dashed border-ocean-200 overflow-hidden flex items-center justify-center mb-2">
                  {files[field] ? (
                    <img src={URL.createObjectURL(files[field])} alt={label} className="w-full h-full object-cover" />
                  ) : existingImages[field] ? (
                    <img src={resolveImageUrl(existingImages[field])} alt={label} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-ocean-400">No image</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={(e) => handleFileChange(field, e.target.files)}
                  className="text-xs w-full"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Place'}
          </button>
          <Link to="/admin/dashboard" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
