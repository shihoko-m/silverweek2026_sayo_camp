
/* Password gate */
const PASSWORD_HASH = "a27cdb983ace1908f422ec4a358ac3a539e958786b1c82c838bf93ccde2e8bb3";
const PASSWORD_SESSION_KEY = "sayo_trip_authenticated";

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2,"0")).join("");
}

const passwordGate = document.getElementById("passwordGate");
const passwordForm = document.getElementById("passwordForm");
const passwordInput = document.getElementById("passwordInput");
const passwordMessage = document.getElementById("passwordMessage");
const passwordToggle = document.getElementById("passwordToggle");
const passwordPanel = document.querySelector(".password-gate__panel");

function unlockPage(animate=true) {
  if(!passwordGate) return;
  document.body.classList.remove("is-locked");
  passwordGate.setAttribute("aria-hidden","true");
  if(animate) {
    passwordGate.classList.add("is-unlocking");
    setTimeout(() => passwordGate.hidden = true, 700);
  } else {
    passwordGate.hidden = true;
  }
}

if(sessionStorage.getItem(PASSWORD_SESSION_KEY) === "1") {
  unlockPage(false);
} else {
  requestAnimationFrame(() => passwordInput?.focus());
}

passwordForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const hash = await sha256(passwordInput?.value || "");
  if(hash === PASSWORD_HASH) {
    sessionStorage.setItem(PASSWORD_SESSION_KEY,"1");
    passwordMessage.textContent = "";
    unlockPage(true);
  } else {
    passwordMessage.textContent = "パスワードが違います。";
    passwordPanel?.classList.remove("shake");
    void passwordPanel?.offsetWidth;
    passwordPanel?.classList.add("shake");
    passwordInput?.select();
    passwordInput?.focus();
  }
});

passwordToggle?.addEventListener("click", () => {
  if(!passwordInput) return;
  const show = passwordInput.type === "password";
  passwordInput.type = show ? "text" : "password";
  passwordToggle.textContent = show ? "隠す" : "表示";
  passwordInput.focus();
});

const header = document.getElementById('header');
    const backtop = document.getElementById('backtop');

    const menuBtn = document.getElementById('menuBtn');
    const globalNav = document.getElementById('globalNav');
    const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');

    function setMenu(open){
      if(!menuBtn || !globalNav) return;
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
      globalNav.classList.toggle('open', open);
      header.classList.toggle('menu-open', open);
      document.body.classList.toggle('menu-open', open);
      mobileNavBackdrop?.classList.toggle('show', open);
      mobileNavBackdrop?.setAttribute('aria-hidden', String(!open));
    }

    function closeMenu(){
      setMenu(false);
    }

    menuBtn?.addEventListener('click', () => {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });

    mobileNavBackdrop?.addEventListener('click', closeMenu);

    globalNav?.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
      if(event.key === 'Escape' && menuBtn?.getAttribute('aria-expanded') === 'true'){
        closeMenu();
        menuBtn.focus();
      }
    });

    window.addEventListener('resize', () => {
      if(window.innerWidth > 980) closeMenu();
    });

    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:.12, rootMargin:'0px 0px -5% 0px'});
    document.querySelectorAll('.reveal,.stagger').forEach(el=>observer.observe(el));

    const sections = [...document.querySelectorAll('main section[id]')];
    const navLinks = [...document.querySelectorAll('.nav a')];
    const spy = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          navLinks.forEach(a=>a.style.opacity = a.getAttribute('href') === '#' + entry.target.id ? '1' : '.72');
        }
      })
    }, {rootMargin:'-30% 0px -62% 0px'});
    sections.forEach(s=>spy.observe(s));

    backtop.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

    /* route data */
    const routeData = [
      {day:1,title:'Horumon Teppanyaki ふじ',desc:'佐用名物ホルモン焼きうどんで、旅のスタート。',meta:'1日目ランチ'},
      {day:1,title:'マックスバリュ佐用店',desc:'BBQ食材や飲み物、氷をまとめて調達。',meta:'買い出し'},
      {day:1,title:'ポパイテンキャンプ場',desc:'高台で設営。夕方からは焚き火とお酒の時間へ。',meta:'宿泊・夜のメイン'},
      {day:2,title:'味わいの里三日月',desc:'2日目ランチは石臼挽きの手打ちそば。',meta:'2日目ランチ'},
      {day:2,title:'飛龍の滝',desc:'食後に少しだけ自然散策。30〜45分の気分転換。',meta:'自然散策'},
      {day:2,title:'天然温泉 佐用の湯',desc:'やわらかい湯に浸かって、2日目の締めへ。',meta:'温泉'},
      {day:3,title:'平福の町並み',desc:'最終日は因幡街道の宿場町をゆっくり散策。',meta:'町歩き'},
      {day:3,title:'道の駅 宿場町ひらふく',desc:'旅の締めに、お土産を買って帰路へ。',meta:'お土産'}
    ];

    const routeWrap = document.getElementById('routeWrap');
    const routeCanvas = document.getElementById('routeCanvas');
    const routeSvg = document.getElementById('routeSvg');
    const routePath = document.getElementById('routePathTrace');
    const routePathBase = document.getElementById('routePathBase');
    const routeCar = document.getElementById('routeCar');
    const routeProgressBar = document.getElementById('routeProgressBar');
    const routeFinish = document.getElementById('routeFinish');
    const routeScrollerNote = document.getElementById('routeScrollerNote');
    const routeStops = [...document.querySelectorAll('.route-stop')];
    const routeCards = [...document.querySelectorAll('.route-card')];
    const routeDays = [...document.querySelectorAll('.route-day')];

    const mobileCard = document.getElementById('mobileRouteCard');
    const mobileStopNo = document.getElementById('mobileStopNo');
    const mobileRouteDay = document.getElementById('mobileRouteDay');
    const mobileRouteTitle = document.getElementById('mobileRouteTitle');
    const mobileRouteDesc = document.getElementById('mobileRouteDesc');
    const mobileRouteMeta = document.getElementById('mobileRouteMeta');

    let pathLength = 0;
    let currentIndex = -1;
    let mobileMode = false;

    const desktopPoints = [
      [110,455],[245,420],[385,500],[545,365],
      [700,485],[845,300],[990,405],[1110,360]
    ];
    const mobilePoints = [
      [440,95],[440,185],[440,275],[440,365],
      [440,455],[440,545],[440,635],[440,725]
    ];

    function setStopPosition(stop,i,x,y,mobile){
      const circle = stop.querySelector('.route-stop-dot');
      const idx = stop.querySelector('.route-stop-index');
      const emoji = stop.querySelector('.route-stop-emoji');
      const label = stop.querySelector('.route-stop-label');

      circle.setAttribute('cx',x); circle.setAttribute('cy',y);
      idx.setAttribute('x',x); idx.setAttribute('y',y);

      if(mobile){
        emoji.setAttribute('x', x - 48);
        emoji.setAttribute('y', y);
        label.setAttribute('x', x + 28);
        label.setAttribute('y', y + 4);
      }
    }

    function setResponsiveRoute(){
      mobileMode = window.innerWidth <= 900;

      const desktopPath = 'M110 455 C170 420,205 400,245 420 S345 530,385 500 S500 340,545 365 S650 520,700 485 S795 270,845 300 S930 430,990 405 S1065 375,1110 360';
      const mobilePath  = 'M440 95 C415 130,415 155,440 185 S465 245,440 275 S415 335,440 365 S465 425,440 455 S415 515,440 545 S465 605,440 635 S415 695,440 725';

      if(mobileMode){
        routeSvg.setAttribute('viewBox','0 0 880 820');
        routePath.setAttribute('d',mobilePath);
        routePathBase.setAttribute('d',mobilePath);
        routeStops.forEach((stop,i)=>setStopPosition(stop,i,...mobilePoints[i],true));
      }else{
        routeSvg.setAttribute('viewBox','0 0 1200 700');
        routePath.setAttribute('d',desktopPath);
        routePathBase.setAttribute('d',desktopPath);
        desktopPoints.forEach((point,i)=>{
          const [x,y]=point;
          const stop=routeStops[i];
          const circle=stop.querySelector('.route-stop-dot');
          const idx=stop.querySelector('.route-stop-index');
          circle.setAttribute('cx',x);circle.setAttribute('cy',y);
          idx.setAttribute('x',x);idx.setAttribute('y',y);
        });
      }

      requestAnimationFrame(()=>{
        pathLength = routePath.getTotalLength();
        routePath.style.strokeDasharray = `${pathLength} ${pathLength}`;
        routePath.style.strokeDashoffset = `${pathLength}`;
        updateRouteAnimation();
      });
    }

    function getActiveDay(index){
      return routeData[Math.max(0,index)]?.day || 1;
    }

    function switchMobileCard(index){
      if(!mobileCard || index < 0 || !routeData[index]) return;
      const item = routeData[index];
      mobileCard.classList.add('switching');
      setTimeout(()=>{
        mobileStopNo.textContent = `STOP ${String(index+1).padStart(2,'0')} / 08`;
        mobileRouteDay.textContent = `DAY ${item.day}`;
        mobileRouteTitle.textContent = item.title;
        mobileRouteDesc.textContent = item.desc;
        mobileRouteMeta.textContent = item.meta;
        mobileCard.classList.remove('switching');
      },120);
    }

    function setActiveIndex(index){
      if(index === currentIndex) return;
      currentIndex = index;

      routeStops.forEach((el,i)=>{
        el.classList.toggle('active',i <= index);
        el.classList.toggle('current',i === index);
      });
      routeCards.forEach((el,i)=>el.classList.toggle('show',!mobileMode && i === index));

      const day = getActiveDay(index);
      routeDays.forEach(el=>el.classList.toggle('active',Number(el.dataset.day) === day));

      if(mobileMode) switchMobileCard(index);
    }

    function updateRouteAnimation(){
      if(!routeWrap || !routePath || !routeCanvas || !pathLength) return;

      const rect = routeWrap.getBoundingClientRect();
      const viewport = window.innerHeight;
      const totalScrollable = Math.max(1,rect.height - viewport);
      const current = Math.min(Math.max(-rect.top,0),totalScrollable);
      const progress = Math.min(Math.max(current / totalScrollable,0),1);

      routePath.style.strokeDashoffset = `${pathLength * (1-progress)}`;
      routeProgressBar.style.width = `${progress*100}%`;

      const len = pathLength * progress;
      const p = routePath.getPointAtLength(len);
      const p2 = routePath.getPointAtLength(Math.min(pathLength,len+4));
      let angle = Math.atan2(p2.y-p.y,p2.x-p.x)*180/Math.PI;

      /* side-view car feels more natural with limited body pitch */
      if(!mobileMode) angle = Math.max(-13,Math.min(13,angle));
      else angle = 0;

      const vb = routeSvg.viewBox.baseVal;
      const cr = routeCanvas.getBoundingClientRect();
      const px = (p.x/vb.width)*cr.width;
      const py = (p.y/vb.height)*cr.height;
      const bob = Math.sin(progress*42)*1.2;
      const carHalf = mobileMode ? 36 : 53;

      routeCar.style.transform = `translate(${px-carHalf}px, ${py-(mobileMode?27:35)+bob}px) rotate(${angle}deg)`;

      /* distribute arrivals evenly across scroll progress */
      const index = Math.min(routeData.length-1,Math.floor(progress*routeData.length));
      setActiveIndex(index);

      routeFinish.classList.toggle('show',progress > .965);
      routeScrollerNote?.classList.toggle('hide',progress > .12);
    }

    function onScroll(){
      const y = window.scrollY;
      header.classList.toggle('scrolled',y>20);
      backtop.classList.toggle('show',y>650);

      const hero = document.querySelector('.hero');
      if(hero && y < innerHeight){
        hero.style.backgroundPosition = `center ${Math.min(50,y*.03)}px`;
      }
      updateRouteAnimation();
    }

    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',setResponsiveRoute);
    window.addEventListener('load',setResponsiveRoute);
    setResponsiveRoute();
    onScroll();
