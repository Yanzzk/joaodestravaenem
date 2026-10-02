(() => {
  // === ASSET PROTECTION SHIELD ===
  // Blocks right-click save, drag-to-desktop, and devtools image copy on media assets.

  // 1. Block right-click on images and the whole page
  document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO' || e.target.tagName === 'SOURCE') {
      e.preventDefault();
      return false;
    }
  }, true);

  // 2. Block drag on all images and videos (prevents drag-to-desktop save)
  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
      e.preventDefault();
      return false;
    }
  }, true);

  // 3. Apply unselectable + undraggable attributes to all current and future images
  const shield = (el) => {
    if (el.tagName === 'IMG' || el.tagName === 'VIDEO') {
      el.setAttribute('draggable', 'false');
      el.style.userSelect = 'none';
      el.style.webkitUserSelect = 'none';
      el.style.pointerEvents = 'auto';
      // Transparent overlay trick: wrap image in a container with pseudo-element
      if (!el.dataset.shielded) {
        el.dataset.shielded = '1';
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';
        wrapper.style.width = '100%';
        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(el);
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:absolute;inset:0;z-index:2;background:transparent;';
        wrapper.appendChild(overlay);
      }
    }
  };

  // Shield existing elements
  document.querySelectorAll('img, video').forEach(shield);

  // Shield future elements via MutationObserver
  new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      m.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          if (node.tagName === 'IMG' || node.tagName === 'VIDEO') shield(node);
          node.querySelectorAll && node.querySelectorAll('img, video').forEach(shield);
        }
      });
    });
  }).observe(document.body, { childList: true, subtree: true });

  // 4. Block common keyboard shortcuts for saving (Ctrl+S, Ctrl+U, Ctrl+Shift+I)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && (e.key === 's' || e.key === 'S' || e.key === 'u' || e.key === 'U')) {
      e.preventDefault();
      return false;
    }
  }, true);
})();
