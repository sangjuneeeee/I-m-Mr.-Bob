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

document.addEventListener("DOMContentLoaded", function () {
	document.addEventListener("scroll", function () {
		const mainSection = document.querySelector(".main-section");
		const cards = document.querySelectorAll(".card");
		const scrollY = window.scrollY;
		const viewportHeight = window.innerHeight;

		// 메인 섹션 글씨 크기 조절
		const scaleFactor = Math.min(1 + scrollY / viewportHeight, 2);
		mainSection.style.fontSize = `${48 * scaleFactor}px`;

		// 카드 상태 업데이트
		cards.forEach((card) => {
			const cardPosition = card.getBoundingClientRect().top;
			const cardHeight = card.offsetHeight;
			const cardCenter = cardPosition + cardHeight / 2;
			const viewportCenter = viewportHeight / 2;

			// 현재 상태 초기화
			card.classList.remove("previous", "next");

			if (Math.abs(cardCenter - viewportCenter) < cardHeight / 3.5) {
				card.classList.remove("previous", "next");
			} else if (cardCenter < viewportCenter - cardHeight / 4) {
				card.classList.add("previous");
			} else if (cardCenter > viewportCenter + cardHeight / 4) {
				card.classList.add("next");
			}
		});
	});

	// 스크롤 스냅 함수
	function snapToCard() {
		const cards = document.querySelectorAll(".card");
		const viewportHeight = window.innerHeight;
		const viewportCenter = viewportHeight / 2;
		let closestCard = null;
		let minDistance = Number.MAX_VALUE;

		cards.forEach((card) => {
			const cardPosition = card.getBoundingClientRect().top;
			const cardHeight = card.offsetHeight;
			const cardCenter = cardPosition + cardHeight / 2;
			const distance = Math.abs(cardCenter - viewportCenter);

			if (distance < minDistance) {
				minDistance = distance;
				closestCard = card;
			}
		});

		if (closestCard) {
			closestCard.scrollIntoView({ behavior: "smooth", block: "center" });
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
			isScrolling = setTimeout(snapToCard, 50); // 스냅 트리거 시간을 줄여 빠르게 반응하도록 설정
		}
	});

	// 드래그로 스크롤할 수 있게 하는 기능 추가
	let isDragging = false;
	let startY;
	let scrollStart;

	window.addEventListener("mousedown", (e) => {
		isDragging = true;
		startY = e.pageY;
		scrollStart = window.scrollY;
	});

	window.addEventListener("mousemove", (e) => {
		if (isDragging) {
			const deltaY = startY - e.pageY;
			window.scrollTo(0, scrollStart + deltaY);
		}
	});

	window.addEventListener("mouseup", () => {
		isDragging = false;
	});

	window.addEventListener("mouseleave", () => {
		isDragging = false;
	});
});
