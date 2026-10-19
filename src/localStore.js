const PREFIX = "ed_local_";

function read(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw == null) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveDoc(key, data) {
  localStorage.setItem(PREFIX + key, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("ed-local", { detail: { key } }));
}

export function subscribe(key, callback) {
  function emit() {
    callback(read(key));
  }
  function onLocal(event) {
    if (event.detail?.key === key) emit();
  }
  function onStorage(event) {
    if (event.key === PREFIX + key) emit();
  }
  window.addEventListener("ed-local", onLocal);
  window.addEventListener("storage", onStorage);
  emit();
  return () => {
    window.removeEventListener("ed-local", onLocal);
    window.removeEventListener("storage", onStorage);
  };
}
