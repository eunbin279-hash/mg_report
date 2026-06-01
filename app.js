document.addEventListener('DOMContentLoaded', () => {
    
    /* --- Scene 3: Floating Background --- */
    const floatingBg = document.getElementById('floating-bg');
    const createFloatingElement = () => {
        const el = document.createElement('div');
        el.classList.add('floating-item');
        
        // Randomize between cookie image and text number
        if (Math.random() > 0.5) {
            const img = document.createElement('img');
            img.src = 'assets/cookie.png';
            img.classList.add('floating-cookie');
            // Random size
            const size = Math.random() * 40 + 30; // 30px to 70px
            img.style.width = `${size}px`;
            el.appendChild(img);
        } else {
            const num = document.createElement('span');
            num.classList.add('floating-number');
            const values = ['+100', '+200', '+500', '+1000'];
            num.innerText = values[Math.floor(Math.random() * values.length)];
            // Random color variation
            num.style.opacity = Math.random() * 0.5 + 0.5;
            el.appendChild(num);
        }

        // Random starting position
        el.style.left = `${Math.random() * 100}vw`;
        
        // Random animation duration and delay
        const duration = Math.random() * 5 + 5; // 5s to 10s
        el.style.animationDuration = `${duration}s`;
        el.style.animationDelay = `${Math.random() * 5}s`;

        floatingBg.appendChild(el);

        // Remove element after animation finishes
        setTimeout(() => {
            if (el.parentNode === floatingBg) {
                floatingBg.removeChild(el);
            }
        }, (duration + 5) * 1000);
    };

    // Initialize initial floating elements
    for(let i=0; i<15; i++) {
        createFloatingElement();
    }
    // Continuously create them
    setInterval(createFloatingElement, 1000);


    /* --- Scene 4: Scroll Animation (Split Cookie) --- */
    const splitContainer = document.getElementById('split-cookie-container');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a small delay for dramatic effect
                setTimeout(() => {
                    splitContainer.classList.add('split-active');
                }, 500);
                // observer.unobserve(entry.target); // Unobserve if you want it to happen only once
            } else {
                // Remove class when out of view to re-trigger animation when scrolling back
                splitContainer.classList.remove('split-active');
            }
        });
    }, { threshold: 0.6 });

    observer.observe(splitContainer);


    /* --- Scene 6: Contract Simulation Game --- */
    const cards = document.querySelectorAll('.contract-card .select-btn');
    const modal = document.getElementById('result-modal');
    const closeBtn = document.querySelector('.close-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const debtCounter = document.getElementById('debt-counter');
    let counterInterval;

    const scenarios = {
        'A': {
            title: '위험 경고: 누적/후차감의 늪!',
            desc: '월 200만 원은 달콤해 보이지만, 수익이 200만 원에 못 미치면 남은 금액은 빚으로 이월됩니다. 게다가 플랫폼 수수료를 먼저 떼는 후차감 방식이라 실제 손에 쥐는 돈은 훨씬 적습니다.',
            debt: -15000000
        },
        'B': {
            title: '경고: 그래도 빚이 쌓입니다!',
            desc: '선차감이라 A플랫폼보다는 나은 조건이지만, 여전히 누적 MG이기 때문에 한 달이라도 성과가 부진하면 마이너스 수익이 꼬리표처럼 따라붙습니다.',
            debt: -8000000
        },
        'C': {
            title: '안전: 정산금은 적을 수 있지만...',
            desc: '보장된 기본급은 없어서 당장의 생계는 어려울 수 있습니다. 하지만 적어도 수익이 마이너스가 되어 플랫폼에 빚을 지는 일은 없습니다.',
            debt: 0
        }
    };

    cards.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const platform = e.target.closest('.contract-card').getAttribute('data-platform');
            const data = scenarios[platform];
            
            modalTitle.innerText = data.title;
            modalDesc.innerText = data.desc;
            debtCounter.innerText = '0원';
            modal.classList.add('active');

            // Counter animation
            if (counterInterval) clearInterval(counterInterval);
            if (data.debt < 0) {
                let current = 0;
                const target = data.debt;
                const step = target / 50; // 50 frames
                counterInterval = setInterval(() => {
                    current += step;
                    if (current <= target) {
                        current = target;
                        clearInterval(counterInterval);
                    }
                    debtCounter.innerText = `현재 부채: ${Math.floor(current).toLocaleString()}원`;
                    debtCounter.style.color = current < -10000000 ? '#C0392B' : 'var(--warning-color)';
                }, 30);
            } else {
                debtCounter.innerText = '현재 부채: 0원';
                debtCounter.style.color = '#27AE60';
            }
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        if (counterInterval) clearInterval(counterInterval);
    });


    /* --- Scene 7: MG Explanations & Tooltips --- */
    const toxicKeywords = document.querySelectorAll('.toxic-keyword');
    const tooltipDisplay = document.getElementById('tooltip-display');
    const defaultTooltipText = '마우스를 올려 확인해보세요.';

    toxicKeywords.forEach(keyword => {
        keyword.addEventListener('mouseenter', (e) => {
            const desc = e.target.getAttribute('data-desc');
            tooltipDisplay.innerText = desc;
            tooltipDisplay.style.backgroundColor = '#FFEAEA';
            tooltipDisplay.style.color = 'var(--warning-color)';
            tooltipDisplay.style.fontWeight = '700';
            e.target.classList.add('active-highlight');
        });

        keyword.addEventListener('mouseleave', (e) => {
            tooltipDisplay.innerText = defaultTooltipText;
            tooltipDisplay.style.backgroundColor = 'var(--dark-panel)';
            tooltipDisplay.style.color = 'white';
            tooltipDisplay.style.fontWeight = '400';
            e.target.classList.remove('active-highlight');
        });
    });

    // Auto highlight using IntersectionObserver for Scene 7
    const scene7 = document.getElementById('scene-7');
    const scene7Observer = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting) {
            let delay = 500;
            toxicKeywords.forEach((k) => {
                setTimeout(() => {
                    k.classList.add('active-highlight');
                    setTimeout(() => k.classList.remove('active-highlight'), 800);
                }, delay);
                delay += 800;
            });
        }
    }, { threshold: 0.5 });
    
    scene7Observer.observe(scene7);
});
