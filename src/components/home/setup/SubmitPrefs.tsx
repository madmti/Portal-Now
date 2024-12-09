import { useState } from 'preact/hooks';

export default function SubmitPrefs() {
	const [active, setActive] = useState(false);
	const [error, setError] = useState('');

	async function onClick() {
		const form = document.getElementById('prefs-form') as HTMLFormElement;
		const formData = new FormData(form);
		try {
			setActive(true);
			const res = await fetch('/api/home/setup/saveprefs/', {
				method: 'POST',
				body: formData,
			});

			if (res.redirected) {
				window.location.assign(res.url);
			}

			if (!res.ok) {
				setActive(false);
				setError(await res.text());
				setTimeout(() => {
					setError('');
				}, 2500);
			}
		} catch (error: any) {
			setActive(false);
			setError(error.message);
			setTimeout(() => {
				setError('');
			}, 2500);
		}
	}

	return (
		<>
			<button
				type="button"
				className={`btn btn-primary btn-wide ${
					active ? 'btn-disabled' : error ? 'btn-error' : ''
				}`}
				onClick={onClick}
			>
				{active ? (
					<span className="loading" />
				) : (
					<span className="icon-[bx--save] text-2xl" />
				)}
				Guardar preferencias
			</button>
			{error && (
				<div className="toast toast-center">
					<div role="alert" className="alert alert-error">
						<span class="icon-[codicon--error] text-2xl text-base-content" />
						<span>{error}</span>
					</div>
				</div>
			)}
		</>
	);
}
