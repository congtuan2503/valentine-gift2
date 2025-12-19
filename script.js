const scenes = {
    intro: document.getElementById('intro-scene'),
    desk: document.getElementById('desk-scene')
};

const giftBox = document.getElementById('gift-box');
const itemsInBox = document.getElementById('items-in-box');
const modal = document.getElementById('modal-overlay');
const audioMsg = document.getElementById('bg-music');

let viewedItems = new Set();
const photos = ['assets/gallery/photo1.jpg', 'assets/gallery/photo2.jpg', 'assets/gallery/photo3.jpg'];
let currentPhotoIdx = 0;

// Chuyển từ Intro sang Desk
document.getElementById('start-btn').addEventListener('click', () => {
    scenes.intro.style.opacity = '0';
    setTimeout(() => {
        scenes.intro.classList.remove('active');
        scenes.desk.classList.add('active');
        scenes.desk.style.opacity = '1';
    }, 1500);
});

// Mở hộp quà
giftBox.addEventListener('click', () => {
    giftBox.classList.add('shake');
    setTimeout(() => {
        giftBox.classList.remove('shake');
        giftBox.src = 'assets/gift-box-open.png';
        itemsInBox.classList.remove('hidden');
        document.getElementById('gift-hint').innerText = "Ngày kỉ niệm: 11/08/2025";
    }, 1000);
});

// Xử lý các vật phẩm
function showModal(contentId) {
    modal.classList.remove('hidden');
    document.querySelectorAll('.content-piece').forEach(p => p.classList.add('hidden'));
    document.getElementById(contentId).classList.remove('hidden');
    viewedItems.add(contentId);
}

document.getElementById('flower-item').addEventListener('click', () => alert("Bông hoa này sẽ không bao giờ héo, giống như tình yêu của anh!"));
document.getElementById('letter-item').addEventListener('click', () => showModal('letter-viewer'));
document.getElementById('cassette-item').addEventListener('click', () => {
    showModal('audio-viewer');
    audioMsg.play();
});
document.getElementById('photo-item').addEventListener('click', () => {
    showModal('photo-viewer');
    updatePhoto();
});

// Đóng modal khi bấm ra ngoài
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.add('hidden');
        audioMsg.pause();
        checkAllViewed();
    }
});

// Chuyển ảnh bằng phím mũi tên
function updatePhoto() {
    document.getElementById('current-photo').src = photos[currentPhotoIdx];
}

window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('hidden') && !document.getElementById('photo-viewer').classList.contains('hidden')) {
        if (e.key === 'ArrowRight') {
            currentPhotoIdx = (currentPhotoIdx + 1) % photos.length;
            updatePhoto();
        } else if (e.key === 'ArrowLeft') {
            currentPhotoIdx = (currentPhotoIdx - 1 + photos.length) % photos.length;
            updatePhoto();
        }
    }
});

// Kiểm tra nếu đã xem hết để hiện Calendar
function checkAllViewed() {
    if (viewedItems.has('letter-viewer') && viewedItems.has('audio-viewer') && viewedItems.has('photo-viewer')) {
        setTimeout(() => showModal('calendar-viewer'), 1000);
    }
}