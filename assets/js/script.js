const inputImage = document.getElementById("input-image");
const inputName = document.getElementById("input-name");
const inputPosition = document.getElementById("input-position");
const inputMessage = document.getElementById("input-message");

const previewImg = document.getElementById("preview-img");
const previewName = document.getElementById("preview-name");
const previewPosition = document.getElementById("preview-position");
const previewMessage = document.getElementById("preview-message");

const btnDownload = document.getElementById("btn-download");
const cardPreview = document.getElementById("card-preview");

const sliderMessage = document.getElementById("slider-message");
const currentFontSizeMessage = parseInt(getComputedStyle(previewMessage).fontSize);

sliderMessage.value = currentFontSizeMessage;

sliderMessage.addEventListener("input", () => {
  const size = sliderMessage.value + "px";
  previewMessage.style.fontSize = size;
});

const sliderName = document.getElementById("slider-name");
const currentFontSizeName = parseInt(getComputedStyle(previewName).fontSize);

sliderName.value = currentFontSizeName;

sliderName.addEventListener("input", () => {
  const size = sliderName.value + "px";
  previewName.style.fontSize = size;
});

const sliderPosition = document.getElementById("slider-position");
const currentFontSizePosition = parseInt(getComputedStyle(previewPosition).fontSize);

sliderPosition.value = currentFontSizePosition;

sliderPosition.addEventListener("input", () => {
  const size = sliderPosition.value + "px";
  previewPosition.style.fontSize = size;
});

// Khi chọn ảnh
inputImage.addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    previewImg.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

// Khi nhập Họ tên
inputName.addEventListener("input", function () {
  previewName.textContent = this.value;
});

// Khi nhập Chức vụ
inputPosition.addEventListener("input", function () {
  previewPosition.textContent = this.value;
});

// Khi nhập Lời nhắn
inputMessage.addEventListener("input", function () {
  previewMessage.textContent = this.value;
});

let designHeight = null;

const bgImg = new Image();
bgImg.src = "assets/image/nen.png";
bgImg.onload = function () {
  designHeight = bgImg.naturalHeight;
};

btnDownload.addEventListener("click", function () {
  if (!cardPreview) {
    console.error("Không tìm thấy #card-preview");
    return;
  }

  const rect = cardPreview.getBoundingClientRect();
  const currentHeight = rect.height;

  let scale = 2;
  if (designHeight && currentHeight) {
    scale = designHeight / currentHeight;
  }

  console.log("currentHeight =", currentHeight, "scale =", scale);

  html2canvas(cardPreview, {
    scale: scale,
    useCORS: true,
    backgroundColor: null,
  }).then((canvas) => {
    const link = document.createElement("a");
    link.download = "the-dai-bieu.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});

const cropModal = document.getElementById("crop-modal");
const cropImage = document.getElementById("crop-image");
const cropConfirm = document.getElementById("crop-confirm");
const cropCancel = document.getElementById("crop-cancel");
const btnEdit = document.getElementById("btn-edit");

let cropper = null;
let originalImageDataUrl = null; // lưu ảnh gốc lần đầu chọn

// Hàm mở popup crop từ ảnh gốc
function openCropperFromOriginal() {
  if (!originalImageDataUrl) return;

  cropImage.src = originalImageDataUrl;
  cropModal.style.display = "flex";

  cropImage.onload = function () {
    if (cropper) {
      cropper.destroy();
    }
    cropper = new Cropper(cropImage, {
      aspectRatio: 1, // tỉ lệ khung ảnh, chỉnh theo .photo-slot
      viewMode: 1,
      movable: true,
      zoomable: true,
      responsive: true,
      background: false,
    });
  };
}

// 1. Chọn file → lưu ảnh gốc → mở popup crop
inputImage.addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    originalImageDataUrl = e.target.result; // LƯU ảnh gốc
    openCropperFromOriginal(); // Mở popup crop luôn
  };
  reader.readAsDataURL(file);
});

// 2. Bấm "Dùng ảnh này" → lấy ảnh đã cắt, gán vào preview-img
cropConfirm.addEventListener("click", function () {
  if (!cropper) return;

  const canvas = cropper.getCroppedCanvas({
    width: 400, // kích thước ảnh xuất ra, bạn chỉnh được
    height: 500,
  });

  // Đưa ảnh cắt vào khung preview của thẻ
  previewImg.src = canvas.toDataURL("image/png");

  // Đóng popup + hủy cropper
  cropper.destroy();
  cropper = null;
  cropModal.style.display = "none";

  // Bật nút "Chỉnh sửa ảnh"
  btnEdit.disabled = false;
  btnEdit.style.opacity = 1;
});

// 3. Hủy: đóng popup, không đổi preview-img
cropCancel.addEventListener("click", function () {
  if (cropper) {
    cropper.destroy();
    cropper = null;
  }
  cropModal.style.display = "none";
});

// 4. Nhấn "Chỉnh sửa ảnh" → mở lại popup crop từ ảnh gốc
btnEdit.addEventListener("click", function () {
  // Không cần chọn file lại, dùng originalImageDataUrl
  openCropperFromOriginal();
});
