// ==========================================================
// resources/js/map/markers.js
// ==========================================================

// 🔹 Dipanggil saat area di peta diklik
export function addRegionToList(id, name) {
  console.log(`🟢 Klik area: ${name} (ID: ${id})`);

  // 🔹 Tampilkan ke daftar HTML jika elemen tersedia
  const listEl = document.getElementById("region-list");
  if (!listEl) return;

  const item = document.createElement("li");
  item.textContent = `${name} (ID: ${id})`;
  listEl.appendChild(item);
}
