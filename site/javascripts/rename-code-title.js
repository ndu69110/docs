// docs/javascripts/rename-code-title.js
(function () {
  function renameTextOnlyNodes() {
    // Walk the document for text nodes that equal "Text Only" (case-insensitive)
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue) return NodeFilter.FILTER_REJECT;
        if (node.nodeValue.trim().toLowerCase() === 'text only') return NodeFilter.FILTER_ACCEPT;
        return NodeFilter.FILTER_REJECT;
      }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(node => {
      node.nodeValue = node.nodeValue.replace(/Text\s*Only/i, 'Command line');
    });
  }

  // Run once on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renameTextOnlyNodes);
  } else {
    renameTextOnlyNodes();
  }

  // Also watch for dynamic changes (Material inserts parts after load sometimes)
  const observer = new MutationObserver(() => renameTextOnlyNodes());
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
})();
