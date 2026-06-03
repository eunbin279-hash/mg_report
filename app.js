document.addEventListener('DOMContentLoaded', () => {

    /* --- Chat Animation (All Scenes) --- */
    const chatContainers = document.querySelectorAll('.chat-container');
    const chatObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const container = entry.target;

                // Animate characters if they exist in this container's parent section
                const section = container.closest('section');
                const characters = section ? section.querySelectorAll('.character:not(.visible)') : [];
                characters.forEach((char, index) => {
                    setTimeout(() => {
                        char.classList.add('visible');
                    }, index * 400);
                });

                let messageDelay = characters.length > 0 ? 1000 : 200;

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
    }, { threshold: 0.3 });

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

    const modalCalc = document.getElementById('modal-calc');
    const selectedContractDisplay = document.getElementById('selected-contract-display');

    const scenarios = {
        'A': {
            title: '계약 A 결과 (가정: 매출 500만원 발생)',
            calcHTML: `
                <ul class="calc-list">
                    <li><strong>총 매출:</strong> 5,000,000원</li>
                    <li><strong>플랫폼 수수료(30%) 공제 (후차감):</strong> 남은 3,500,000원</li>
                    <li><strong>에이전시/작가 수익 분배 (5:5):</strong> 1,750,000원</li>
                    <li><strong>선지급된 보장금 (월 400만원) 차감:</strong> 1,750,000원 - 4,000,000원</li>
                    <li class="calc-result error-text">작가 추가 수익: 0원 (오히려 빚 225만원 발생)</li>
                </ul>
            `,
            desc: '월 400만 원은 달콤해 보이지만, 플랫폼 수수료를 먼저 떼는 후차감 방식이기에 500만원을 벌어도 남은 수익에서 400만원을 갚기엔 턱없이 부족합니다. 이대로면 매달 빚(누적 MG)이 쌓이게 됩니다.',
            profit: -2250000
        },
        'B': {
            title: '계약 B 결과 (가정: 매출 500만원 발생)',
            calcHTML: `
                <ul class="calc-list">
                    <li><strong>총 매출:</strong> 5,000,000원</li>
                    <li><strong>보장금 최우선 차감 (선차감):</strong> 5,000,000원 - 2,000,000원 = 3,000,000원</li>
                    <li><strong>남은 수익 분배 (작가 30%):</strong> 900,000원</li>
                    <li class="calc-result success-text">작가 추가 수익: 900,000원 (총 수익: 2,900,000원)</li>
                </ul>
            `,
            desc: '선차감 방식이라 전체 매출에서 보장금을 빼기 때문에 추가 수익 90만원을 받을 수 있습니다. 하지만 만약 매출이 200만원 이하라면 역시나 마이너스 수익이 꼬리표처럼 따라붙는 누적 MG의 위험이 있습니다.',
            profit: 2900000
        },
        'C': {
            title: '계약 C 결과 (가정: 매출 500만원 발생)',
            calcHTML: `
                <ul class="calc-list">
                    <li><strong>총 매출:</strong> 5,000,000원</li>
                    <li><strong>플랫폼 수수료 등 공제 후 순수익:</strong> 3,500,000원</li>
                    <li><strong>수익 분배 (작가 70%):</strong> 2,450,000원</li>
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
            const cardElement = e.target.closest('.contract-card');
            const platform = cardElement.getAttribute('data-platform');
            const data = scenarios[platform];

            document.querySelectorAll('.contract-card').forEach(c => c.classList.remove('selected'));
            cardElement.classList.add('selected');

            modalTitle.innerText = data.title;
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
    const tooltipDisplay = document.getElementById('tooltip-display');
    const defaultTooltipText = '마우스를 올려 확인해보세요.';

    function bindTooltips(elements) {
        elements.forEach(keyword => {
            keyword.addEventListener('mouseenter', (e) => {
                const desc = e.target.getAttribute('data-desc');
                if (!desc) return;
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
    }

    const initialToxicKeywords = document.querySelectorAll('.guide-group .toxic-keyword');
    bindTooltips(initialToxicKeywords);

    let currentInlineTooltip = null;
    function bindContractHighlights(container) {
        const keywords = container.querySelectorAll('.pulse-hl');

        keywords.forEach(keyword => {
            keyword.addEventListener('click', (e) => {
                e.stopPropagation();

                if (currentInlineTooltip) {
                    currentInlineTooltip.remove();
                }

                const desc = e.target.getAttribute('data-desc');
                if (!desc) return;

                const tooltip = document.createElement('div');
                tooltip.classList.add('inline-tooltip');

                const title = e.target.getAttribute('data-title');
                if (title) {
                    tooltip.innerHTML = `<strong style="color: var(--accent-color); display: block; margin-bottom: 5px; font-size: 1.1rem;">${title}</strong>${desc}`;
                } else {
                    tooltip.innerText = desc;
                }

                document.body.appendChild(tooltip);

                const rect = e.target.getBoundingClientRect();
                tooltip.style.left = `${rect.left + window.scrollX + (rect.width / 2)}px`;
                tooltip.style.top = `${rect.bottom + window.scrollY + 10}px`;

                requestAnimationFrame(() => {
                    tooltip.classList.add('show');
                });

                currentInlineTooltip = tooltip;
            });
        });
    }

    document.addEventListener('click', () => {
        if (currentInlineTooltip) {
            currentInlineTooltip.remove();
            currentInlineTooltip = null;
        }
    });

    // Auto highlight using IntersectionObserver for Scene 7
    const scene7 = document.getElementById('scene-7');
    const scene7Observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            let delay = 500;
            const currentKeywords = document.querySelectorAll('.guide-group .toxic-keyword');
            currentKeywords.forEach((k) => {
                setTimeout(() => {
                    k.classList.add('active-highlight');
                    setTimeout(() => k.classList.remove('active-highlight'), 800);
                }, delay);
                delay += 800;
            });

        }
    }, { threshold: 0.3 });

    scene7Observer.observe(scene7);
});
