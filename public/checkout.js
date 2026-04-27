(function() {
  const OKWEPAY_URL = "https://okwepay.vercel.app"; // Your production domain

  window.Okwepay = {
    checkout: function(options) {
      if (!options.payment_id) {
        console.error("Okwepay: payment_id is required.");
        return;
      }

      // Create overlay
      const overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100vw";
      overlay.style.height = "100vh";
      overlay.style.backgroundColor = "rgba(0,0,0,0.6)";
      overlay.style.zIndex = "999999";
      overlay.style.display = "flex";
      overlay.style.justifyContent = "center";
      overlay.style.alignItems = "center";

      // Create modal container
      const modal = document.createElement("div");
      modal.style.width = "400px";
      modal.style.height = "600px";
      modal.style.maxWidth = "90vw";
      modal.style.maxHeight = "90vh";
      modal.style.backgroundColor = "#fff";
      modal.style.borderRadius = "12px";
      modal.style.overflow = "hidden";
      modal.style.position = "relative";
      modal.style.boxShadow = "0 25px 50px -12px rgba(0, 0, 0, 0.25)";

      // Close button
      const closeBtn = document.createElement("button");
      closeBtn.innerHTML = "&times;";
      closeBtn.style.position = "absolute";
      closeBtn.style.top = "10px";
      closeBtn.style.right = "15px";
      closeBtn.style.background = "transparent";
      closeBtn.style.border = "none";
      closeBtn.style.fontSize = "24px";
      closeBtn.style.cursor = "pointer";
      closeBtn.style.color = "#666";
      closeBtn.style.zIndex = "10";
      
      closeBtn.onclick = function() {
        document.body.removeChild(overlay);
        if (options.onClose) options.onClose();
      };

      // Iframe
      const iframe = document.createElement("iframe");
      iframe.src = `${OKWEPAY_URL}/pay/${options.payment_id}?embedded=true`;
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "none";

      modal.appendChild(closeBtn);
      modal.appendChild(iframe);
      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      // Listen for messages from iframe
      const messageListener = function(event) {
        if (event.origin !== OKWEPAY_URL) return;
        
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'OKWEPAY_SUCCESS' && data.payment_id === options.payment_id) {
            window.removeEventListener('message', messageListener);
            document.body.removeChild(overlay);
            if (options.onSuccess) options.onSuccess(data);
          }
        } catch (e) {
          // ignore
        }
      };

      window.addEventListener('message', messageListener);
    }
  };
})();
