// Same-origin frame-buster only (S1). Modern Chrome blocks a cross-origin
// subframe from navigating the top frame, so this does NOT stop a
// cross-origin embedder from iframing the site. Real protection needs
// real response headers (frame-ancestors) — see README "Hosting decision".
if (window.top !== window.self) { try { window.top.location = window.self.location; } catch (e) {} }
