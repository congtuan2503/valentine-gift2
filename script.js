// --- CẤU HÌNH ---
// Danh sách ảnh kỷ niệm (Tên file trong folder assets/gallery/)
const photoList = [
    'photo1.jpg', 
    'photo2.jpg', 
    'photo3.jpg' // Thêm tên ảnh của bạn vào đây
];

// --- TRẠNG THÁI ---
let currentPhotoIndex = 0;
// Biến theo dõi xem đã mở những gì
const viewedItems = {
    flower: false,
    letter: false,
    cassette: false,
    photos: false
};

// --- DOM ELEMENTS ---
const introScreen = document.getElementById('intro-screen');
const deskScreen = document.getElementById('desk-screen');
const startBtn = document.getElementById('start-btn');
const modalOverlay = document.getElementById('modal-overlay');
const hoverLabel = document.getElementById('hover-label');
const audioPlayer = document.getElementById('audio-player');

// --- HÀM KHỞI TẠO (START GAME) ---
startBtn.addEventListener('click', () => {
    // Hiệu ứng Fade out / Morph
    introScreen.classList.add('fade-out');
    
    setTimeout(() => {
        introScreen.classList.add('hidden');
        deskScreen.classList.remove('hidden');
        // Xoá class fade-out để nếu reset game thì ko bị lỗi
        introScreen.classList.remove('fade-out');
    }, 1000); // Chờ 1s cho animation css chạy xong
});

// --- XỬ LÝ HOVER ITEM ---
document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        hoverLabel.innerText = item.getAttribute('data-label');
    });
    item.addEventListener('mouseleave', () => {
        hoverLabel.innerText = '';
    });
    
    // Xử lý Click mở Modal
    item.addEventListener('click', (e) => {
        e.stopPropagation(); // Ngăn click lan ra ngoài
        const type = item.id.replace('item-', '');
        openModal(type);
    });
});

// --- LOGIC MODAL ---
function openModal(type) {
    modalOverlay.classList.remove('hidden');
    
    // Ẩn tất cả nội dung modal con trước
    document.querySelectorAll('.modal-content').forEach(el => el.classList.add('hidden'));

    // Đánh dấu đã xem
    viewedItems[type] = true;

    // Hiển thị nội dung tương ứng
    if (type === 'photos') {
        document.getElementById('modal-photos').classList.remove('hidden');
        showPhoto(currentPhotoIndex);
    } else if (type === 'cassette') {
        document.getElementById('modal-cassette').classList.remove('hidden');
        audioPlayer.play();
    } else if (type === 'letter') {
        document.getElementById('modal-letter').classList.remove('hidden');
    } else if (type === 'flower') {
        document.getElementById('modal-flower').classList.remove('hidden');
    }
}

// Đóng modal khi click ra ngoài (vào phần overlay mờ)
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeAllModals();
    }
});

function closeAllModals() {
    modalOverlay.classList.add('hidden');
    audioPlayer.pause(); // Dừng nhạc nếu đang nghe
    audioPlayer.currentTime = 0; // Tua lại đầu
    
    checkCompletion(); // Kiểm tra xem đã xem hết chưa
}

// --- LOGIC GALLERY ẢNH ---
function showPhoto(index) {
    const imgElement = document.getElementById('current-photo');
    imgElement.src = `assets/gallery/${photoList[index]}`;
}

document.addEventListener('keydown', (e) => {
    // Chỉ hoạt động khi modal Photos đang mở
    if (!document.getElementById('modal-photos').classList.contains('hidden')) {
        if (e.key === 'ArrowRight') {
            currentPhotoIndex = (currentPhotoIndex + 1) % photoList.length;
            showPhoto(currentPhotoIndex);
        } else if (e.key === 'ArrowLeft') {
            currentPhotoIndex = (currentPhotoIndex - 1 + photoList.length) % photoList.length;
            showPhoto(currentPhotoIndex);
        }
    }
});

// --- LOGIC END GAME (CALENDAR) ---
function checkCompletion() {
    // Kiểm tra xem tất cả các mục đã xem chưa
    const allViewed = Object.values(viewedItems).every(status => status === true);
    
    if (allViewed) {
        setTimeout(() => {
            modalOverlay.classList.remove('hidden');
            document.querySelectorAll('.modal-content').forEach(el => el.classList.add('hidden'));
            document.getElementById('modal-calendar').classList.remove('hidden');
        }, 1000); // Đợi 1s sau khi đóng modal cuối cùng
    }
}

// Nút chốt đơn trong Calendar
document.getElementById('confirm-date').addEventListener('click', () => {
    const date = document.getElementById('date-picker').value;
    alert(`Yeah! Hẹn gặp em vào ngày ${date}. Yêu em! ❤️`);
    modalOverlay.classList.add('hidden');
});