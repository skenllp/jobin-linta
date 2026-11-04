(function(){
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Gate / opening interaction ----
  var html = document.documentElement;
  html.classList.add('locked');
  var gate = document.getElementById('gate');
  var enterBtn = document.getElementById('enterBtn');

  function openGate(){
    if(gate.classList.contains('opening')) return;
    gate.classList.add('opening');
    startAmbience();
    petalBurst();
    setTimeout(function(){
      gate.classList.add('hidden');
      html.classList.remove('locked');
      window.scrollTo(0,0);
    }, 1450);
  }
  enterBtn.addEventListener('click', openGate);

  // ---- Scroll reveal ----
  var revealEls = document.querySelectorAll('.reveal');
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach(function(el){ io.observe(el); });

  // ---- Wedding song ----
  var musicBtn = document.getElementById('music-toggle');
  var song = document.getElementById('wedding-song');
  var playing = false;

  function playSong(){
    if(!song || playing) return;
    song.play().then(function(){
      playing = true;
      musicBtn.classList.remove('muted');
      try{ localStorage.setItem('lj_music', 'on'); }catch(e){}
    }).catch(function(err){ console.warn('Playback blocked', err); });
  }
  function pauseSong(){
    if(!song || !playing) return;
    song.pause();
    playing = false;
    musicBtn.classList.add('muted');
    try{ localStorage.setItem('lj_music', 'off'); }catch(e){}
  }

  // Tapping "Enter the Celebration" is a genuine user gesture, so the
  // song can start right there without triggering the browser's
  // autoplay block.
  function startAmbience(){ playSong(); }

  musicBtn.addEventListener('click', function(){
    if(playing){ pauseSong(); } else { playSong(); }
  });

  // ---- Tap to reveal couple photo ----
  var couplePhoto = document.querySelector('.couple-photo');
  if(couplePhoto){
    couplePhoto.addEventListener('click', function(){
      couplePhoto.classList.add('revealed');
    });
  }

  // ---- Parallax on scroll ----
  if(!reducedMotion){
    var parallaxLayers = document.querySelectorAll('.parallax-layer');
    var pTicking = false;
    function updateParallax(){
      parallaxLayers.forEach(function(el){
        var section = el.closest('section');
        if(!section) return;
        var rect = section.getBoundingClientRect();
        var factor = parseFloat(el.getAttribute('data-parallax')) || 0.15;
        var offset = rect.top * factor;
        el.style.transform = 'translateY(' + (-offset) + 'px)';
      });
      pTicking = false;
    }
    window.addEventListener('scroll', function(){
      if(!pTicking){ requestAnimationFrame(updateParallax); pTicking = true; }
    }, { passive:true });
    updateParallax();
  }

  // ---- Petal burst (on Enter) ----
  function petalBurst(){
    if(reducedMotion) return;
    var container = document.createElement('div');
    container.className = 'petal-burst';
    document.body.appendChild(container);
    var colors = ['#ffffff', '#DCEAF3', '#C4D9EA', '#F7F3EC'];
    var count = 14;
    for(var i = 0; i < count; i++){
      var p = document.createElement('div');
      p.className = 'petal';
      var size = 9 + Math.random() * 9;
      var drift = (Math.random() * 70 - 35);
      p.style.left = (Math.random() * 100) + 'vw';
      p.style.width = size + 'px';
      p.style.height = (size * 0.78) + 'px';
      p.style.background = colors[i % colors.length];
      p.style.animationDelay = (Math.random() * 0.7) + 's';
      p.style.animationDuration = (3.4 + Math.random() * 2) + 's';
      p.style.setProperty('--drift', drift + 'px');
      container.appendChild(p);
    }
    setTimeout(function(){ container.remove(); }, 6500);
  }

  // ---- Card tilt (hover-capable desktop only) ----
  if(!reducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches){
    document.querySelectorAll('.event-card').forEach(function(card){
      card.addEventListener('mousemove', function(e){
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;
        var rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 5;
        card.style.transform = 'perspective(900px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
      });
      card.addEventListener('mouseleave', function(){
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
      });
    });
  }
})();
