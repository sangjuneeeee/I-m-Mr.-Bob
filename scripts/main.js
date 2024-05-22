window.addEventListener("scroll", () => {
	const mainSection = document.querySelector(".main-section");
	const animationSection = document.getElementById("animation-section");
	const scrollY = window.scrollY;

	if (scrollY < window.innerHeight) {
		// Prevent scrolling
		window.scrollTo(0, 0);

		// Calculate the amount of "crumpling"
		const crumpleAmount = Math.min(scrollY / window.innerHeight, 1);

		// Apply crumple effect to main section
		mainSection.style.transform = `scale(${1 - crumpleAmount * 0.5}) rotate(${
			crumpleAmount * 15
		}deg)`;
		mainSection.style.opacity = `${1 - crumpleAmount}`;

		// Show animation section gradually
		animationSection.style.transform = `translateY(${(1 - crumpleAmount) * 100}%)`;
	} else {
		// Allow scrolling in animation section
		animationSection.style.transform = "translateY(0)";
	}
});
