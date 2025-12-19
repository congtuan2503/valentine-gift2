// CẤU HÌNH DANH SÁCH ẢNH CỦA BẠN Ở ĐÂY
const photos = [
    'assets/gallery/photo1.jpg',
    'assets/gallery/photo2.jpg',
    // Thêm tên ảnh khác vào đây nếu có
];

// Trạng thái các vật phẩm đã xem
const viewedItems = {
    flower: false,
    letter: false,
    cassette: false,
    photo: false
};

// DOM Elements
const introScreen = document.getElementById('intro-screen');
const deskScreen = document.getElementById('desk-screen');
const startBtn = document.getElementById('start-btn');
const overlay = document.getElementById('overlay');
const closeArea = document.getElementById('close-area');
const tooltip = document.getElementById('tooltip');
const clickSound = document.getElementById('click-sound');

// Logic: Chuyển từ Intro sang Desk
startBtn.addEventListener('click', () => {
    playSound();
    introScreen.style.opacity = '0';
    
    setTimeout(() => {
        introScreen.classList.add('hidden');
        deskScreen.classList.remove('hidden');
        // Kích hoạt fade-in cho desk
        setTimeout(() => {
            deskScreen.style.opacity = '1';
        }, 50);
    }, 1000); // Đợi 1s cho hiệu ứng fade out xong
});

// Logic: Tooltip khi hover vật phẩm
const items = document.querySelectorAll('.item');

items.forEach(item => {
    item.addEventListener('mousemove', (e) => {
        tooltip.classList.remove('hidden');
        tooltip.textContent = item.getAttribute('data-tooltip');
        // Tooltip đi theo chuột
        // Lấy vị trí tương đối trong game-container để tooltip không bị lệch
        const containerRect = document.getElementById('game-container').getBoundingClientRect();
        tooltip.style.left = (e.clientX - containerRect.left + 15) + 'px';
        tooltip.style.top = (e.clientY - containerRect.top + 15) + 'px';
    });

    item.addEventListener('mouseleave', () => {
        tooltip.classList.add('hidden');
    });

    item.addEventListener('click', () => {
        playSound();
        const type = item.id.replace('item-', '');
        openModal(type);
    });
});

// Logic: Mở Modal
function openModal(type) {
    overlay.classList.remove('hidden');
    
    // Ẩn tất cả nội dung modal con trước
    document.querySelectorAll('.modal-content').forEach(el => el.classList.add('hidden'));

    // Đánh dấu đã xem
    viewedItems[type] = true;

    // Hiển thị nội dung tương ứng
    if (type === 'flower') {
        document.getElementById('modal-flower').classList.remove('hidden');
    } else if (type === 'letter') {
        document.getElementById('modal-letter').classList.remove('hidden');
    } else if (type === 'cassette') {
        document.getElementById('modal-cassette').classList.remove('hidden');
        document.getElementById('audio-player').play();
    } else if (type === 'photo') {
        document.getElementById('modal-gallery').classList.remove('hidden');
        loadPhoto(0); // Load ảnh đầu tiên
    }

    checkCompletion();
}

// Logic: Đóng Modal khi bấm ra ngoài
closeArea.addEventListener('click', () => {
    overlay.classList.add('hidden');
    
    // Dừng nhạc nếu đang mở cassette
    const audio = document.getElementById('audio-player');
    audio.pause();
    audio.currentTime = 0;
});

// Logic: Gallery SlideShow
let currentPhotoIndex = 0;
const galleryImg = document.getElementById('gallery-img');

function loadPhoto(index) {
    if (index < 0) index = photos.length - 1;
    if (index >= photos.length) index = 0;
    currentPhotoIndex = index;
    galleryImg.src = photos[currentPhotoIndex];
}

document.getElementById('prev-btn').addEventListener('click', (e) => {
    e.stopPropagation(); // Ngăn việc bấm nút mà bị đóng modal
    playSound();
    loadPhoto(currentPhotoIndex - 1);
});

document.getElementById('next-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    playSound();
    loadPhoto(currentPhotoIndex + 1);
});

// Bắt sự kiện phím mũi tên
document.addEventListener('keydown', (e) => {
    if (!document.getElementById('modal-gallery').classList.contains('hidden')) {
        if (e.key === 'ArrowLeft') loadPhoto(currentPhotoIndex - 1);
        if (e.key === 'ArrowRight') loadPhoto(currentPhotoIndex + 1);
    }
});

// Logic: Kiểm tra đã xem hết chưa để hiện Calendar
function checkCompletion() {
    // Kiểm tra xem tất cả các mục trong viewedItems có là true không
    const allViewed = Object.values(viewedItems).every(status => status === true);
    
    if (allViewed) {
        // Nếu đã xem hết, đợi user đóng modal hiện tại rồi hiện Calendar
        // Hoặc có thể hiện 1 nút thông báo mới ở góc màn hình.
        // Ở đây mình sẽ làm: Khi user đóng modal cuối cùng, Calendar tự hiện ra sau 1s
    }
}

// Sửa lại sự kiện đóng modal để trigger Calendar
closeArea.addEventListener('click', () => {
    // ... code cũ ...
    
    // Check xem xong hết chưa để mở Calendar
    const allViewed = Object.values(viewedItems).every(status => status === true);
    if (allViewed) {
        setTimeout(() => {
            overlay.classList.remove('hidden');
            document.querySelectorAll('.modal-content').forEach(el => el.classList.add('hidden'));
            document.getElementById('modal-calendar').classList.remove('hidden');
        }, 500); // Delay nhẹ cho tự nhiên
    }
});

document.getElementById('confirm-date').addEventListener('click', () => {
    const date = document.getElementById('date-picker').value;
    alert(`Đã chốt kèo ngày ${date}! Yêu em ❤️`);
    playSound();
});

function playSound() {
    // Reset thời gian để bấm liên tục vẫn kêu
    clickSound.currentTime = 0;
    clickSound.play().catch(e => {}); // Catch lỗi nếu trình duyệt chặn auto-play
}