document.addEventListener("DOMContentLoaded", function () {
	const cardsContainer = document.getElementById("vertical-carousel");
	const drawings = JSON.parse(localStorage.getItem("drawings")) || [];

	// 로컬스토리지에서 데이터 분리
	const groupedDrawings = drawings.reduce((groups, drawing) => {
		const key = drawing.title.split("_")[0];
		if (!groups[key]) {
			groups[key] = [];
		}
		groups[key].push(drawing);
		return groups;
	}, {});

	// 각 객체 카드 생성
	Object.keys(groupedDrawings).forEach((groupKey) => {
		const group = groupedDrawings[groupKey];
		const horizontalCarousel = document.createElement("div");
		horizontalCarousel.classList.add("horizontal-carousel");

		group.forEach((drawing, index) => {
			const card = document.createElement("div");
			card.classList.add("card");
			card.innerHTML = `
                <img class="art" src="${drawing.dataURL}" alt="${drawing.title}">
                <img class="frame" src="./images/frame.png" alt="Frame">
                <div class="caption">
                    <label class="caption_title">${drawing.title}</label>
                    <hr style="margin:3px">
                    <div class="caption_detail">
                        <label>pixel on canvas</label>
                        <label>600 x 415.03 px</label>
                        <label>2024</label>
                    </div>
                </div>
            `;
			card.addEventListener("click", () => showModal(drawing.dataURL));
			horizontalCarousel.appendChild(card);
		});

		const groupContainer = document.createElement("div");
		groupContainer.classList.add("group-container");
		groupContainer.appendChild(horizontalCarousel);

		const buttonWrapper = document.createElement("div");
		buttonWrapper.classList.add("carousel-button-wrapper");

		const leftButton = document.createElement("button");
		leftButton.classList.add("carousel-button", "left");
		leftButton.innerText = "<";
		leftButton.addEventListener("click", () => scrollCarousel(horizontalCarousel, -1));

		const deleteButton = document.createElement("button");
		deleteButton.classList.add("carousel-button", "delete");
		deleteButton.innerText = "Delete";
		deleteButton.addEventListener("click", () => deleteCurrentCard(horizontalCarousel));

		const rightButton = document.createElement("button");
		rightButton.classList.add("carousel-button", "right");
		rightButton.innerText = ">";
		rightButton.addEventListener("click", () => scrollCarousel(horizontalCarousel, 1));

		// 버튼을 버튼 래퍼에 추가
		buttonWrapper.appendChild(leftButton);
		buttonWrapper.appendChild(deleteButton);
		buttonWrapper.appendChild(rightButton);

		// 버튼 래퍼를 그룹 컨테이너에 추가
		horizontalCarousel.appendChild(buttonWrapper);

		// 그룹 컨테이너를 카드 컨테이너에 추가
		cardsContainer.appendChild(groupContainer);

		// 업데이트
		updateCarouselClasses(horizontalCarousel);
	});

	function scrollCarousel(carousel, direction) {
		const cards = Array.from(carousel.querySelectorAll(".card"));
		if (direction === 1) {
			carousel.appendChild(cards.shift());
		} else {
			carousel.insertBefore(cards.pop(), cards[0]);
		}
		updateCarouselClasses(carousel);
	}

	function deleteCurrentCard(carousel) {
		const cards = Array.from(carousel.querySelectorAll(".card"));
		if (cards.length === 0) return;

		const currentCard = cards[0];
		currentCard.classList.add("removing");

		setTimeout(() => {
			const drawingTitle = currentCard.querySelector(".caption_title").innerText;

			// 로컬 스토리지에서 삭제
			let drawings = JSON.parse(localStorage.getItem("drawings")) || [];
			drawings = drawings.filter((drawing) => drawing.title !== drawingTitle);
			localStorage.setItem("drawings", JSON.stringify(drawings));

			// DOM에서 카드 삭제
			currentCard.remove();
			updateCarouselClasses(carousel);

			// 카드 삭제
			if (carousel.querySelectorAll(".card").length === 0) {
				groupContainer.classList.add("removing");

				setTimeout(() => {
					groupContainer.remove();
				}, 500); // 애니메이션 지속 시간 후 삭제
			}
		}, 500); // 애니메이션 지속 시간 후 삭제
	}

	function updateCarouselClasses(carousel) {
		const cards = Array.from(carousel.querySelectorAll(".card"));
		const centerIndex = 0; // 0번 인덱스를 기준으로 중앙에 배치

		cards.forEach((card, index) => {
			card.classList.remove("previous", "next");
			if (index === centerIndex) {
				card.classList.remove("previous", "next");
			} else if (index > centerIndex) {
				card.classList.add("next");
			} else if (index < centerIndex) {
				card.classList.add("previous");
			}
		});

		// 카드 배치
		const cardWidth = cards[0].offsetWidth;
		const carouselWidth = carousel.offsetWidth;
		const offset = Math.floor(carouselWidth / 2 - cardWidth / 2);

		cards.forEach((card, index) => {
			card.style.transform = `translateX(${index * (cardWidth + 20) + offset}px)`;
		});
	}

	const audio = document.getElementById("bgm");
	audio.volume = 0.1;

	document.addEventListener("scroll", function () {
		const groups = document.querySelectorAll(".group-container");
		const layers = document.querySelectorAll(".layer");
		const logo = document.getElementById("logo");

		const scrollY = window.scrollY;
		const viewportHeight = window.innerHeight;

		// 로고 효과
		const scaleFactor = Math.min(1 + scrollY / (viewportHeight / 2), 5); // 비율을 크게 조정
		logo.style.width = `${90 * scaleFactor}px`;

		// 패럴랙스 효과
		layers.forEach((layer, index) => {
			const depth = index === 0 ? 1 : 100;
			const scale = 1 + (scrollY / (viewportHeight * 5)) * depth;
			layer.style.transform = `scale(${scale})`;
		});

		// 그룹 상태 업데이트
		groups.forEach((group) => {
			const groupPosition = group.getBoundingClientRect().top;
			const groupHeight = group.offsetHeight;
			const groupCenter = groupPosition + groupHeight / 2;
			const viewportCenter = viewportHeight / 2;

			// 현재 상태 초기화
			group.classList.remove("previous", "next");

			if (Math.abs(groupCenter - viewportCenter) < groupHeight / 4) {
				group.classList.remove("previous", "next");
			} else if (groupCenter < viewportCenter - groupHeight / 4) {
				group.classList.add("previous");
			} else if (groupCenter > viewportCenter + groupHeight / 4) {
				group.classList.add("next");
			}
		});

		// 커튼 효과
		const leftCurtain = document.querySelector(".curtain-left");
		const rightCurtain = document.querySelector(".curtain-right");
		const startScroll = viewportHeight;
		const endScroll = viewportHeight * 1.5;

		if (scrollY >= startScroll && scrollY <= endScroll) {
			const progress = (scrollY - startScroll) / (endScroll - startScroll);
			const offset = 100 * progress;

			leftCurtain.style.transform = `translateX(${offset}%)`;
			rightCurtain.style.transform = `translateX(${-offset}%)`;
		} else if (scrollY < startScroll) {
			leftCurtain.style.transform = "translateX(-100%)";
			rightCurtain.style.transform = "translateX(100%)";
		} else if (scrollY > endScroll) {
			leftCurtain.style.transform = "translateX(100%)";
			rightCurtain.style.transform = "translateX(-100%)";
		}
	});

	// 스크롤 스냅 함수
	function snapToGroup() {
		const groups = document.querySelectorAll(".group-container");
		const viewportHeight = window.innerHeight;
		const viewportCenter = viewportHeight / 2;
		let closestGroup = null;
		let minDistance = Number.MAX_VALUE;

		groups.forEach((group) => {
			const groupPosition = group.getBoundingClientRect().top;
			const groupHeight = group.offsetHeight;
			const groupCenter = groupPosition + groupHeight / 2;
			const distance = Math.abs(groupCenter - viewportCenter);

			if (distance < minDistance) {
				minDistance = distance;
				closestGroup = group;
			}
		});

		if (closestGroup) {
			closestGroup.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	}

	// 스크롤 이벤트가 끝났을 때 스냅을 호출
	let isScrolling;
	window.addEventListener("scroll", function () {
		const mainContainer = document.querySelector(".main-container");
		const mainContainerHeight = mainContainer.offsetHeight;
		const scrollY = window.scrollY;

		// main-container가 지나고 난 후에만 스냅 기능이 작동하도록 조건 추가
		if (scrollY > mainContainerHeight) {
			window.clearTimeout(isScrolling);
			isScrolling = setTimeout(snapToGroup, 50); // 스냅 트리거 시간을 줄여 빠르게 반응하도록 설정
		}
	});
});

function scrollCarousel(carousel, direction) {
	const cards = carousel.querySelectorAll(".card");
	if (direction === 1) {
		carousel.appendChild(cards[0]);
	} else {
		carousel.insertBefore(cards[cards.length - 1], cards[0]);
	}
}

function showLoaderAndNavigate() {
	const loader = document.getElementById("loader");
	loader.classList.remove("hidden");

	setTimeout(() => {
		document.body.classList.add("reveal");

		setTimeout(() => {
			window.location.href = "./pages/canvas.html";
		}, 1300);
	}, 100); // 100ms 후에 reveal 클래스를 추가하여 애니메이션 시작
}

function showModal(imageSrc) {
	const modal = document.getElementById("modal");
	const modalArt = modal.querySelector(".modal-content");
	const modalArts = modal.querySelector(".modalArt");

	modalArts.src = imageSrc;
	modal.classList.add("visible");

	modalArt.onmousemove = (e) => {
		const rect = modalArts.getBoundingClientRect();
		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;
		const lightX = 100 - x;
		const lightY = 100 - y;
		requestAnimationFrame(() => {
			modalArt.style.setProperty("--mouseX", `${x}%`);
			modalArt.style.setProperty("--mouseY", `${y}%`);
			modalArt.style.setProperty("--lightX", `${lightX}%`);
			modalArt.style.setProperty("--lightY", `${lightY}%`);
			modalArt.style.transform = `perspective(1000px) rotateY(${(x - 50) / 5}deg) rotateX(${
				-(y - 50) / 5
			}deg)`;
		});
	};

	modalArt.onmouseleave = () => {
		modalArt.style.setProperty("--mouseX", "50%");
		modalArt.style.setProperty("--mouseY", "50%");
		modalArt.style.setProperty("--lightX", "50%");
		modalArt.style.setProperty("--lightY", "50%");
		modalArt.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
	};

	modal.addEventListener("mousemove", handleMouseMove);
	modal.addEventListener("mouseleave", handleMouseLeave);
}

function hideModal(event) {
	const modal = document.getElementById("modal");
	if (event.target === modal) {
		modal.classList.remove("visible");
	}
}
