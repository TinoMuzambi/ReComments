import Link from "next/link";

const index = () => {
	return (
		<main className="main index">
			<div className="topbar">
				<h1 className="title">Welcome to ReComments</h1>
				<Link href="/signin">
					<a className="action">Sign In</a>
				</Link>
			</div>
			<section className="about">
				<h2 className="subtitle">About</h2>
				<p className="text">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus
					dolore ad omnis non soluta deleniti perferendis eius modi asperiores
					vitae nostrum rerum, quibusdam, magni eveniet fuga blanditiis
					aspernatur nam laboriosam inventore sunt suscipit necessitatibus
					incidunt! Officiis repudiandae dolorum architecto vitae veniam quis
					dignissimos doloribus quam. Ullam ipsa excepturi nobis deserunt?
				</p>
			</section>
			<section className="method">
				<h2 className="subtitle">How it works</h2>
				<h5 className="tag">The technical stuff</h5>
				<p className="text">
					Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id
					dignissimos eaque consequatur velit voluptatibus qui beatae tempora
					tempore minus iste similique, a laborum incidunt deserunt. Vel quam
					delectus fugit eaque amet. Numquam mollitia nesciunt, esse corporis
					tempore deserunt quos voluptatum ex voluptas facilis officia quia unde
					error omnis minus iusto!
				</p>
			</section>
		</main>
	);
};

export default index;
