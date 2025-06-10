const urlButton = document.getElementById("url-button");
const urlInput = document.getElementById("url-input");
const qrImage = document.getElementById("qr-image");

const submitUrl = async () => {
  const url = urlInput.value;
  console.log("Submitting URL for QR encoding: ", url);
  // Simple url validation
  if (!url) {
    console.error("Invalid URL");
    return;
  }
  const response = await fetch("./api/encode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: url }),
  }).catch((err) => console.error("URL QR encode error: ", err));
  const jsonResponse = await response.json();
  console.log("json response: ", jsonResponse);
  qrImage.src = jsonResponse.qrData;
};

// Handle user input
urlButton.addEventListener("click", async () => {
  submitUrl();
});

const checkEnterKeyPress = (event) => {
  if (event.key === "Enter" && urlInput === document.activeElement) submitUrl();
};
