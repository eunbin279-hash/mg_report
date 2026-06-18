document.addEventListener('DOMContentLoaded', () => {

    // Start Scene 1 Intro animation on load
    const scene1 = document.getElementById('scene-1');
    if (scene1) {
        setTimeout(() => {
            scene1.classList.add('active');
        }, 150);
    }

    /* --- Character Intro Animation (Scene 2) --- */
    const charIntroContainer = document.querySelector('.character-intro-container');
    if (charIntroContainer) {
        const charIntroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const characters = charIntroContainer.querySelectorAll('.character:not(.visible)');
                    characters.forEach((char, index) => {
                        setTimeout(() => {
                            char.classList.add('visible');
                        }, index * 400);
                    });
                    charIntroObserver.unobserve(charIntroContainer);
                }
            });
        }, { threshold: 0.1 });
        charIntroObserver.observe(charIntroContainer);
    }

    /* --- Chat Animation (All Scenes) --- */
    const chatContainers = document.querySelectorAll('.chat-container');
    const chatObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const container = entry.target;

                let messageDelay = 200;

                const chatMessages = container.querySelectorAll('.chat-message:not(.visible)');
                chatMessages.forEach((msg) => {
                    setTimeout(() => {
                        msg.classList.add('visible');
                        const bubbles = msg.querySelectorAll('.bubble:not(.visible)');
                        bubbles.forEach((bubble, bIndex) => {
                            setTimeout(() => {
                                bubble.classList.add('visible');
                            }, bIndex * 600);
                        });
                    }, messageDelay);

                    const bubbleCount = msg.querySelectorAll('.bubble:not(.visible)').length;
                    messageDelay += (bubbleCount * 600) + 400;
                });

                if (container.id === 'contract-intro-chat') {
                    setTimeout(() => {
                        const hlCard = document.querySelector('#scene-7 .highlight-card');
                        if (hlCard) {
                            const highlights = hlCard.querySelectorAll('.pulse-hl');
                            highlights.forEach((hl, index) => {
                                hl.style.transitionDelay = `${index * 1.5}s`;
                            });
                            hlCard.classList.add('show-highlights');

                            const guideText = document.getElementById('click-guide-text');
                            if (guideText) {
                                setTimeout(() => {
                                    guideText.classList.add('visible');
                                }, highlights.length * 1500); // 하이라이트 애니메이션이 끝나갈 때쯤 표시
                            }
                        }
                    }, messageDelay + 200);
                }

                chatObserver.unobserve(container);
            }
        });
    }, { threshold: 0.15 });

    chatContainers.forEach(container => chatObserver.observe(container));

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
    for (let i = 0; i < 15; i++) {
        createFloatingElement();
    }
    // Continuously create them
    setInterval(createFloatingElement, 1000);


    /* --- Scene 4: Scroll Animation (Split Cookie) --- */
    const scene4 = document.getElementById('scene-4');
    const splitContainer = document.getElementById('split-cookie-container');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a small delay for dramatic effect
                setTimeout(() => {
                    splitContainer.classList.add('split-active');
                }, 500);
            } else {
                // Remove class when out of view to re-trigger animation when scrolling back
                splitContainer.classList.remove('split-active');
            }
        });
    }, { threshold: 0.15 });

    observer.observe(scene4);


    /* --- Scene 6: Contract Simulation Game --- */
    let isScene6Active = false;
    let isContractSelected = false;
    const cards = document.querySelectorAll('.contract-card .select-btn');
    const modal = document.getElementById('result-modal');
    const closeBtn = document.querySelector('.close-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const debtCounter = document.getElementById('debt-counter');
    let counterInterval;

    const modalCalc = document.getElementById('modal-calc');
    const selectedContractDisplay = document.getElementById('selected-contract-display');

    const scenarios = {
        'A': {
            title: '계약 A 결과 <span class="modal-subtitle">(매출 500만원)</span>',
            calcHTML: `
                <ul class="calc-list">
                    <li><strong>총 매출</strong> 5,000,000원</li>
                    <li><strong>플랫폼 수수료(30%) 공제 (후차감)</strong> 남은 3,500,000원</li>
                    <li><strong>에이전시/작가 수익 분배 (5:5)</strong> 1,750,000원</li>
                    <li><strong>선지급된 보장금 (월 400만원) 차감</strong> 1,750,000원 - 4,000,000원</li>
                    <li class="calc-result error-text">작가 추가 수익: 0원 (오히려 빚 225만원 발생)</li>
                </ul>
            `,
            desc: '월 400만 원은 달콤해 보이지만, 플랫폼 수수료를 먼저 떼는 후차감 방식이기에 500만원을 벌어도 남은 수익에서 400만원을 갚기엔 턱없이 부족합니다. 이대로면 매달 빚(누적 MG)이 쌓이게 됩니다.',
            profit: -2250000
        },
        'B': {
            title: '계약 B 결과 <span class="modal-subtitle">(매출 500만원)</span>',
            calcHTML: `
                <ul class="calc-list">
                    <li><strong>총 매출</strong> 5,000,000원</li>
                    <li><strong>보장금 최우선 차감 (선차감)</strong> 5,000,000원 - 2,000,000원 = 3,000,000원</li>
                    <li><strong>남은 수익 분배 (작가 30%)</strong> 900,000원</li>
                    <li class="calc-result success-text">작가 추가 수익: 900,000원 (총 수익: 2,900,000원)</li>
                </ul>
            `,
            desc: '선차감 방식이라 전체 매출에서 보장금을 빼기 때문에 추가 수익 90만원을 받을 수 있습니다. 하지만 만약 매출이 200만원 이하라면 역시나 마이너스 수익이 꼬리표처럼 따라붙는 누적 MG의 위험이 있습니다.',
            profit: 2900000
        },
        'C': {
            title: '계약 C 결과 <span class="modal-subtitle">(매출 500만원)</span>',
            calcHTML: `
                <ul class="calc-list">
                    <li><strong>총 매출</strong> 5,000,000원</li>
                    <li><strong>플랫폼 수수료 등 공제 후 순수익</strong> 3,500,000원</li>
                    <li><strong>수익 분배 (작가 70%)</strong> 2,450,000원</li>
                    <li class="calc-result success-text">최종 작가 수익: 2,450,000원</li>
                </ul>
            `,
            desc: '보장된 기본급은 없어서 당장의 생계는 어려울 수 있습니다. 하지만 적어도 수익이 마이너스가 되어 플랫폼에 빚을 지는 일은 없습니다.',
            profit: 2450000
        }
    };

    const highlightedContracts = {
        'A': `
            <div class="contract-card highlight-card">
                <div class="contract-header">
                    <h3 class="contract-title">웹툰 연재 계약서 (선택됨)</h3>
                    <span class="parties">갑: A 플랫폼<br>을: 신인 작가</span>
                </div>
                <div class="card-body contract-clauses">
                    <p><strong>제 3조 (최소 보장금)</strong><br>"갑"은 "을"에게 <span class="toxic-keyword pulse-hl" data-title="월 MG" data-desc="수익 발생 전 매월 지급받는 가불금입니다.">매월 4,000,000원을 수익으로 선지급하여 보장한다.</span></p>
                    <p><strong>제 5조 (수익 분배 및 정산)</strong><br>매출 발생 시 <span class="toxic-keyword pulse-hl" data-title="후차감" data-desc="플랫폼 수수료를 먼저 뗀 후 작가 몫에서 가불금을 차감하므로 작가에게 매우 불리한 조항입니다.">플랫폼 수수료를 공제한 금액을 "을"의 수익으로 산정한다.</span> "을"의 분배 수익이 기 지급된 보장금에 미달할 경우, 그 미달 금액은 <span class="toxic-keyword pulse-hl" data-title="누적 MG" data-desc="이번 달에 못 갚은 가불금이 다음 달로 이월되어 빚으로 쌓이는 가장 위험한 독소 조항입니다.">익월로 이월되어 누적 상환한다.</span></p>
                </div>
            </div>
        `,
        'B': `
            <div class="contract-card highlight-card">
                <div class="contract-header">
                    <h3 class="contract-title">콘텐츠 제공 계약서 (선택됨)</h3>
                    <span class="parties">갑: B 플랫폼<br>을: 신인 작가</span>
                </div>
                <div class="card-body contract-clauses">
                    <p><strong>제 4조 (수익 배분)</strong><br>"갑"은 "을"에게 <span class="toxic-keyword pulse-hl" data-title="월 MG" data-desc="매달 선지급받는 최소 보장금(가불금)입니다.">매월 2,000,000원의 최소 보장금을 지급한다.</span></p>
                    <p><strong>제 6조 (정산 방식)</strong><br>매출 발생 시 <span class="toxic-keyword pulse-hl" data-title="선차감" data-desc="전체 매출에서 가불금을 먼저 차감하여 후차감보다는 낫지만, 여전히 빚을 갚아야 합니다.">기 지급된 보장금을 최우선으로 공제하며</span>, 상환 후 남은 수익을 "갑"과 "을"이 분배한다. 미상환 보장금은 작품 완결 시까지 <span class="toxic-keyword pulse-hl" data-title="누적 MG" data-desc="성과가 안 좋으면 마이너스 수익이 빚처럼 계속 누적되는 족쇄 조항입니다.">지속 누적된다.</span></p>
                </div>
            </div>
        `,
        'C': `
            <div class="contract-card highlight-card">
                <div class="contract-header">
                    <h3 class="contract-title">독점 연재 합의서 (선택됨)</h3>
                    <span class="parties">갑: C 플랫폼<br>을: 신인 작가</span>
                </div>
                <div class="card-body contract-clauses">
                    <p><strong>제 3조 (수익 정산)</strong><br>작품에서 발생하는 순수익은 "갑"과 "을"이 <span class="toxic-keyword pulse-hl" data-title="RS (수익 배분)" data-desc="발생한 수익을 약정된 비율로 분배하는 정산 방식입니다.">3:7의 비율로 분배한다.</span></p>
                    <p><strong>제 4조 (최소 수익 보장)</strong><br>본 계약은 <span class="toxic-keyword pulse-hl" data-title="MG 없음" data-desc="선지급되는 가불금이 없으므로 빚은 안 생기지만, 당장의 수입 보장이 안 되어 생계가 불안정할 수 있습니다.">별도의 최소 보장금(MG)을 선지급하지 아니하며</span>, 실제 발생한 수익만을 기준으로 배분한다.</p>
                </div>
            </div>
        `
    };

    cards.forEach(btn => {
        btn.addEventListener('click', (e) => {
            isContractSelected = true;
            document.querySelectorAll('.scene.locked').forEach(el => el.classList.remove('locked'));

            const nextGuide = document.getElementById('next-step-guide');
            if (nextGuide) {
                nextGuide.innerText = "서명이 완료되었습니다! 아래로 스크롤하여 계속 진행하세요 ↓";
                nextGuide.style.color = "#27AE60";
            }

            const cardElement = e.target.closest('.contract-card');
            const platform = cardElement.getAttribute('data-platform');
            const data = scenarios[platform];

            document.querySelectorAll('.contract-card').forEach(c => c.classList.remove('selected'));
            cardElement.classList.add('selected');

            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.className = 'modal-content bouncy-popup-anim';
                if (platform === 'A') {
                    modalContent.classList.add('type-danger');
                } else if (platform === 'B') {
                    modalContent.classList.add('type-warning');
                } else {
                    modalContent.classList.add('type-success');
                }
            }

            modalTitle.innerHTML = data.title;
            modalDesc.innerText = data.desc;
            if (modalCalc) modalCalc.innerHTML = data.calcHTML;
            debtCounter.innerText = '0원';
            modal.classList.add('active');

            if (selectedContractDisplay) {
                selectedContractDisplay.innerHTML = highlightedContracts[platform];
                bindContractHighlights(selectedContractDisplay);
            }

            // Counter animation
            if (counterInterval) clearInterval(counterInterval);
            let current = 0;
            const target = data.profit;
            const step = target / 50; // 50 frames

            if (target !== 0) {
                counterInterval = setInterval(() => {
                    current += step;
                    if ((step > 0 && current >= target) || (step < 0 && current <= target)) {
                        current = target;
                        clearInterval(counterInterval);
                    }
                    debtCounter.innerText = `현재 수익: ${Math.floor(current).toLocaleString()}원`;
                    debtCounter.style.color = current < 0 ? '#C0392B' : '#27AE60';
                }, 30);
            } else {
                debtCounter.innerText = '현재 수익: 0원';
                debtCounter.style.color = '#27AE60';
            }
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        if (counterInterval) clearInterval(counterInterval);

        const scene7 = document.getElementById('scene-7');
        if (scene7) {
            scene7.scrollIntoView({ behavior: 'smooth' });

            const hlCard = document.querySelector('#scene-7 .highlight-card');
            if (hlCard) {
                hlCard.classList.remove('show-highlights');
            }

            const guideText = document.getElementById('click-guide-text');
            if (guideText) {
                guideText.classList.remove('visible');
            }

            const contractChat = document.getElementById('contract-intro-chat');
            if (contractChat) {
                // Reset chat animation state
                contractChat.querySelectorAll('.visible').forEach(el => el.classList.remove('visible'));
                // Re-observe to trigger animation when scrolled into view
                chatObserver.observe(contractChat);
            }
        }
    });


    /* --- Scene 7: MG Explanations & Tooltips --- */


    let currentInlineTooltip = null;
    function showInlineTooltip(element, desc, title) {
        if (currentInlineTooltip) {
            currentInlineTooltip.remove();
        }

        const tooltip = document.createElement('div');
        tooltip.classList.add('inline-tooltip');

        if (title) {
            tooltip.innerHTML = `<strong style="color: var(--accent-color); display: block; margin-bottom: 5px; font-size: 1.1rem;">${title}</strong>${desc}`;
        } else {
            tooltip.innerText = desc;
        }

        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX + (rect.width / 2)}px`;
        tooltip.style.top = `${rect.bottom + window.scrollY + 10}px`;

        requestAnimationFrame(() => {
            tooltip.classList.add('show');
        });

        currentInlineTooltip = tooltip;
    }

    function bindContractHighlights(container) {
        const keywords = container.querySelectorAll('.pulse-hl');

        keywords.forEach(keyword => {
            keyword.addEventListener('click', (e) => {
                e.stopPropagation();
                const desc = e.target.getAttribute('data-desc');
                if (!desc) return;
                const title = e.target.getAttribute('data-title');
                showInlineTooltip(e.target, desc, title);
            });
        });
    }

    document.addEventListener('click', () => {
        if (currentInlineTooltip) {
            currentInlineTooltip.remove();
            currentInlineTooltip = null;
        }
    });



    // Auto scroll for contracts on mobile (Scene 6)
    const scene6 = document.getElementById('scene-6');
    const cardContainer = document.querySelector('.card-container');
    let hasAutoScrolled = false;
    
    if (scene6 && cardContainer) {
        const scene6Observer = new IntersectionObserver((entries) => {
            isScene6Active = entries[0].isIntersecting;
            if (entries[0].isIntersecting && window.innerWidth <= 768 && !hasAutoScrolled) {
                hasAutoScrolled = true;
                setTimeout(() => {
                    const secondCard = cardContainer.querySelectorAll('.contract-card')[1];
                    if (secondCard) {
                        const scrollPos = secondCard.offsetLeft - cardContainer.offsetLeft - 15;
                        cardContainer.scrollTo({
                            left: scrollPos,
                            behavior: 'smooth'
                        });
                    }
                }, 3000);
            }
        }, { threshold: 0.5 });
        scene6Observer.observe(scene6);
    }

    // Intercept scroll on Scene 6 if not signed
    const handleScrollAttempt = (e) => {
        if (isScene6Active && !isContractSelected) {
            let isScrollingDown = false;
            if (e.type === 'wheel') {
                if (e.deltaY > 0) isScrollingDown = true;
            } else if (e.type === 'touchmove') {
                isScrollingDown = true; 
            }

            if (isScrollingDown) {
                // Trigger shake effect on all cards to draw attention
                const cardsElements = document.querySelectorAll('.contract-card');
                cardsElements.forEach(card => {
                    card.classList.add('shake-attention');
                    setTimeout(() => {
                        card.classList.remove('shake-attention');
                    }, 600);
                });

                // Highlight the guide message
                const nextGuide = document.getElementById('next-step-guide');
                if (nextGuide) {
                    nextGuide.classList.add('shake-text');
                    nextGuide.style.color = '#E74C3C';
                    setTimeout(() => {
                        nextGuide.classList.remove('shake-text');
                    }, 600);
                }
            }
        }
    };

    window.addEventListener('wheel', handleScrollAttempt, { passive: true });
    window.addEventListener('touchmove', handleScrollAttempt, { passive: true });

    // Outro Campaign Interactive Accordion Toggle
    const outroKeywordItems = document.querySelectorAll('.outro-campaign .keyword-item');
    outroKeywordItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Do not toggle if helper button links are clicked
            if (e.target.closest('.helper-btn')) return;
            
            const isActive = item.classList.contains('active');
            
            // Close other active accordions to keep layout clean
            outroKeywordItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    /* --- Statistical Graphic Animations (Scene 5, 7, 8) --- */
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                
                // Add fade-in active class
                target.classList.add('animate-active');
                
                // 1. Scene 5 Multi Bar Chart Animation
                const segments = target.querySelectorAll('.chart-segment, .sub-segment');
                segments.forEach(seg => {
                    const widthVal = seg.getAttribute('data-width');
                    if (widthVal) {
                        // Delay sub-segments slightly for layered feel
                        const delay = seg.classList.contains('sub-segment') ? 600 : 100;
                        setTimeout(() => {
                            seg.style.width = `${widthVal}%`;
                        }, delay);
                    }
                });

                // 1-2. Scene 4 Partner Ratio Bar Animation
                const partnerSegments = target.querySelectorAll('.partner-segment');
                partnerSegments.forEach(seg => {
                    const widthVal = seg.getAttribute('data-width');
                    if (widthVal) {
                        setTimeout(() => {
                            seg.style.width = `${widthVal}%`;
                        }, 3900);
                    }
                });

                // 2. Scene 7 Split Ratio Bar Animation
                const ratioSegments = target.querySelectorAll('.ratio-segment');
                ratioSegments.forEach(seg => {
                    const widthVal = seg.getAttribute('data-width');
                    if (widthVal) {
                        setTimeout(() => {
                            seg.style.width = `${widthVal}%`;
                        }, 200);
                    }
                });

                // 3. Scene 8 Abuse Dashboard Animations (Bars + CountUp)
                const abuseFills = target.querySelectorAll('.abuse-bar-fill');
                abuseFills.forEach(fill => {
                    const widthVal = fill.getAttribute('data-width');
                    if (widthVal) {
                        setTimeout(() => {
                            fill.style.width = `${widthVal}%`;
                        }, 300);
                    }
                });

                const countNumbers = target.querySelectorAll('.dash-num');
                countNumbers.forEach(numEl => {
                    const targetVal = parseFloat(numEl.getAttribute('data-target'));
                    if (!isNaN(targetVal)) {
                        animateCountUp(numEl, targetVal);
                    }
                });

                // Unobserve once animated
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.15 });

    // Helper function for float count-up
    function animateCountUp(element, target) {
        let current = 0;
        const duration = 1500; // 1.5s animation
        const frameRate = 1000 / 60; // 60fps
        const totalFrames = Math.round(duration / frameRate);
        const increment = target / totalFrames;
        let frame = 0;

        const timer = setInterval(() => {
            frame++;
            current += increment;
            if (frame >= totalFrames) {
                current = target;
                clearInterval(timer);
            }
            element.innerText = `${current.toFixed(1)}%`;
        }, frameRate);
    }

    // Contact popup logic for Scene 1
    const shareMailBtn = document.getElementById('share-mail-btn');
    const contactPopup = document.getElementById('contact-popup');
    const contactPopupClose = document.getElementById('contact-popup-close');

    if (shareMailBtn && contactPopup) {
        shareMailBtn.addEventListener('click', () => {
            contactPopup.classList.add('active');
        });
    }

    if (contactPopupClose && contactPopup) {
        contactPopupClose.addEventListener('click', () => {
            contactPopup.classList.remove('active');
        });

        contactPopup.addEventListener('click', (e) => {
            if (e.target === contactPopup) {
                contactPopup.classList.remove('active');
            }
        });
    }

    const shareTxtBtn = document.getElementById('share-txt-btn');
    if (shareTxtBtn) {
        shareTxtBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('링크가 클립보드에 복사되었습니다! 원하는 곳에 붙여넣어 공유해 보세요.');
            }).catch(err => {
                alert('링크 복사에 실패했습니다. 주소창의 URL을 직접 복사해 주세요.');
            });
        });
    }

    /* --- Damage Cases Carousel Logic --- */
    const carouselTrack = document.querySelector('.carousel-track');
    if (carouselTrack) {
        const cards = carouselTrack.querySelectorAll('.carousel-card');
        const dots = document.querySelectorAll('.carousel-dots .dot');
        let currentIndex = 0;
        let slideInterval = null;

        const showSlide = (index) => {
            cards.forEach(card => {
                card.classList.remove('active', 'prev', 'next');
            });
            dots.forEach(dot => dot.classList.remove('active'));

            const len = cards.length;
            const prevIndex = (index - 1 + len) % len;
            const nextIndex = (index + 1) % len;

            cards[index].classList.add('active');
            cards[prevIndex].classList.add('prev');
            cards[nextIndex].classList.add('next');
            dots[index].classList.add('active');
            
            currentIndex = index;
        };

        const startSlide = () => {
            slideInterval = setInterval(() => {
                let nextIndex = (currentIndex + 1) % cards.length;
                showSlide(nextIndex);
            }, 4500);
        };

        const stopSlide = () => {
            if (slideInterval) clearInterval(slideInterval);
        };

        // Click event for dots
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                showSlide(index);
                stopSlide();
                startSlide();
            });
        });

        // Click event for side cards to slide them into focus
        cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                if (card.classList.contains('prev') || card.classList.contains('next')) {
                    showSlide(index);
                    stopSlide();
                    startSlide();
                }
            });
        });

        // Initialize first state
        showSlide(0);

        // Start auto slide
        startSlide();

        // Pause auto slide on hover
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', stopSlide);
            carouselContainer.addEventListener('mouseleave', startSlide);

            // Touch swipe support for mobile
            let touchStartX = 0;
            let touchEndX = 0;

            carouselContainer.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].clientX;
            }, { passive: true });

            carouselContainer.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].clientX;
                const swipeDistance = touchStartX - touchEndX;
                const threshold = 50; // min distance in pixels

                if (Math.abs(swipeDistance) > threshold) {
                    if (swipeDistance > 0) {
                        // Swipe left -> Next slide
                        let nextIndex = (currentIndex + 1) % cards.length;
                        showSlide(nextIndex);
                    } else {
                        // Swipe right -> Prev slide
                        let prevIndex = (currentIndex - 1 + cards.length) % cards.length;
                        showSlide(prevIndex);
                    }
                    stopSlide();
                    startSlide();
                }
            }, { passive: true });
        }
    }

    /* --- Outro Chat Mystery Friend Reveal Logic --- */
    const outroChat = document.querySelector('.outro-chat-container');
    if (outroChat) {
        const unnamedFriendMsg = outroChat.querySelector('.friend-msg.init-unnamed');
        const introProMsg = outroChat.querySelectorAll('.chat-message.pro-msg')[4]; // 5th pro-msg (index 4)

        if (unnamedFriendMsg && introProMsg) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                     if (mutation.attributeName === 'class' && introProMsg.classList.contains('visible')) {
                         setTimeout(() => {
                             unnamedFriendMsg.classList.remove('init-unnamed');
                         }, 600);
                         observer.disconnect();
                     }
                });
            });
            observer.observe(introProMsg, { attributes: true });
        }
    }

    /* --- Hover Popup Chart Animation Logic --- */
    const statHoverTrigger = document.querySelector('.stat-hover-trigger');
    const hoverPopup = document.querySelector('.statistics-container.hover-popup');
    if (statHoverTrigger && hoverPopup) {
        const segments = hoverPopup.querySelectorAll('.chart-segment, .sub-segment');
        
        statHoverTrigger.addEventListener('mouseenter', () => {
            segments.forEach(seg => {
                const widthVal = seg.getAttribute('data-width');
                if (widthVal) {
                    const delay = seg.classList.contains('sub-segment') ? 400 : 100;
                    setTimeout(() => {
                        seg.style.width = `${widthVal}%`;
                    }, delay);
                }
            });
        });
        
        statHoverTrigger.addEventListener('mouseleave', () => {
            segments.forEach(seg => {
                seg.style.width = '0%';
            });
        });
    }

    // Observer to toggle theme on the fixed share/contact button container depending on whether a dark section is in view
    const darkScenes = document.querySelectorAll('.dark-scene');
    const shareContainer = document.querySelector('.intro-share-container');
    if (darkScenes.length > 0 && shareContainer) {
        const intersectingDarkScenes = new Set();
        const darkObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    intersectingDarkScenes.add(entry.target);
                } else {
                    intersectingDarkScenes.delete(entry.target);
                }
            });
            
            if (intersectingDarkScenes.size > 0) {
                shareContainer.classList.add('on-dark');
            } else {
                shareContainer.classList.remove('on-dark');
            }
        }, { threshold: 0.15 });
        darkScenes.forEach(scene => darkObserver.observe(scene));
    }

    // Register all elements to observe
    const animatedElements = document.querySelectorAll('.init-fade-in, .split-ratio-bar-wrapper, .contract-partner-stats');
    animatedElements.forEach(el => statsObserver.observe(el));
});
