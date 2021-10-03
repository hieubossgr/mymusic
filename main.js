/*
    1. Render Song: render();
    2. Scroll top: handleEvents();
    3. Play / Pause / Seek
    4. CD rotate: Cho nó  quay tròn
    5. Next / Prev song
    6. Random
    7. Next / Repeat when ended
    8. Active song
    9. Play song and click
*/

const PlAYER_STORAGE_KEY = "HIEU_BOSS_GR";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cdClass = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
let listSong;
const playList = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Lối nhỏ',
            singer: 'Đen Vâu',
            path: './assets/mp3/LoiNho.mp3',
            image: './assets/img/LoiNho.jpg'
        },
        {
            name: 'The Player',
            singer: 'Soobin - SlimV',
            path: './assets/mp3/ThePlayer.mp3',
            image: './assets/img/ThePlayer.jpg'
        },
        // {
        //     name: 'Chúng ta của hiện tại',
        //     singer: 'Sơn Tùng MTP',
        //     path: './assets/mp3/ChungTaCuaHienTai.mp3',
        //     image: './assets/img/ChungTaCuaHienTai.jpg'
        // },
        {
            name: 'We don\'t talk any more',
            singer: 'Charlie Puth',
            path: './assets/mp3/WeDontTalkAnyMore.mp3',
            image: './assets/img/WeDontTalkAnyMore.jpg'
        },
        {
            name: 'Thăng điên',
            singer: 'Justatee - Phương Ly',
            path: './assets/mp3/ThangDien.mp3',
            image: './assets/img/ThangDien.jpg'
        },
        {
            name: 'Lối nhỏ',
            singer: 'Đen Vâu',
            path: './assets/mp3/LoiNho.mp3',
            image: './assets/img/LoiNho.jpg'
        },
        {
            name: 'The Player',
            singer: 'Soobin - SlimV',
            path: './assets/mp3/ThePlayer.mp3',
            image: './assets/img/ThePlayer.jpg'
        },
        // {
        //     name: 'Chúng ta của hiện tại',
        //     singer: 'Sơn Tùng MTP',
        //     path: './assets/mp3/ChungTaCuaHienTai.mp3',
        //     image: './assets/img/ChungTaCuaHienTai.jpg'
        // },
        {
            name: 'We don\'t talk any more',
            singer: 'Charlie Puth',
            path: './assets/mp3/WeDontTalkAnyMore.mp3',
            image: './assets/img/WeDontTalkAnyMore.jpg'
        },
        {
            name: 'Thăng điên',
            singer: 'Justatee - Phương Ly',
            path: './assets/mp3/ThangDien.mp3',
            image: './assets/img/ThangDien.jpg'
        }
    ],

    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    render: function() {
        const html = this.songs.map((song, index) => {
            return `
                <div class="song ${index == this.currentIndex ? 'active' : ''}" data-index=${index} >
                    <div class="thumb" style="background-image: url('${song.image}')"></div>
                    <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        }).join('');
        playList.innerHTML = html;
        listSong = $$('.song');
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvents: function() {
        const _this = this;
        const cdWidth = cdClass.offsetWidth;

        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 18000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        // Xử lí phóng to / thu nhỏ CD
        document.onscroll = function() {
            const scroll = window.scrollY || document.documentElement.scrollTop;
            console.log("CDWidth" + cdWidth);
            console.log("scroll "+scroll);
            var newCdWidth = cdWidth - scroll;
            if(newCdWidth > 0) cdClass.style.width = newCdWidth + 'px';
            else cdClass.style.width = 0;
            cdClass.style.opacity = newCdWidth/cdWidth;
        }

        // Xử lí bất / tắt nhạc
        playBtn.onclick = function() {
            _this.isPlaying ? audio.pause() : audio.play();
        }
        
        // Khi Bài hát đc bật. Chạy audio.onplay
        audio.onplay = function() {
            cdThumbAnimate.play();
            player.classList.add('playing');
            _this.isPlaying = true;
        }

        // Khi Bài hát bị tắt. Chạy audio.onpause
        audio.onpause = function() {
            cdThumbAnimate.pause();
            player.classList.remove('playing');
            _this.isPlaying = false;
        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        progress.oninput = function(e) { // e == progress
            const seekTime = audio.duration / 100 * e.target.value; 
            audio.currentTime = seekTime;
        }

        // Click next song
        nextBtn.onclick = function() {
            // player.classList.remove('playing');
            // _this.isPlaying = false;
            // progress.value = 0;
            if(_this.isRandom) _this.randomSong();
            else _this.nextSong();
            audio.play();
            _this.activeSong();
            _this.scrollToActiveSong();
        }

        // Click prev song
        prevBtn.onclick = function() {
            // player.classList.remove('playing');
            // _this.isPlaying = false;
            // progress.value = 0;
            if(_this.isRandom) _this.randomSong();
            else _this.prevSong();
            audio.play();
            _this.activeSong();
            _this.scrollToActiveSong();
        }

        // Click Random song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig("isRandom", _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        //  Click repeat song
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig("isRepeat", _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        audio.onended = function() {
            if(_this.isRepeat) audio.play();
            else nextBtn.click();
        }

        //Xử lí khi click vào song
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')) {
                // _this.currentIndex = songNode.getAttribute('data-index');
                _this.currentIndex = songNode.dataset.index;
                _this.loadCurrentSong();
                _this.render();
                audio.play();

            }
        }
    },

    activeSong: function() {
        listSong.forEach((song, index) => {
            if(this.currentIndex == index)
                song.classList.add('active');
            else song.classList.remove('active');
        })
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        },300)
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    nextSong: function() {
        if(this.currentIndex == this.songs.length-1)
            this.currentIndex = 0;
        else this.currentIndex++;
        this.loadCurrentSong();
    },

    prevSong: function() {
        if(this.currentIndex == 0)
            this.currentIndex = this.songs.length-1;
        else this.currentIndex--;
        this.loadCurrentSong();
    },

    randomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while(newIndex == this.currentIndex )
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function() {
        //Gọi config
        this.loadConfig();

        //Định nghĩa các thuộc tính cho Object
        this.defineProperties();
               
        //Tải bài hát hiện tại
        this.loadCurrentSong();
        
        //Lắng nghe xử lí sự kiện
        this.handleEvents();
        
        //Render PlayList
        this.render();

        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);
    }
}

app.start();
