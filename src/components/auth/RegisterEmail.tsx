import {
	getAuth,
	inMemoryPersistence,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import { app } from '../../firebase/client';
import { useState } from 'preact/hooks';

export default function RegisterEmail() {
	const [active, setActive] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = async () => {
		const form = document.getElementById('registerForm') as HTMLFormElement;
		const formData = new FormData(form);
		const email = formData.get('email')?.toString();
		const password = formData.get('password')?.toString();

		if (!email || !password) {
			setError('Por favor, rellene todos los campos');
			setActive(false);
			setTimeout(() => {
				setError('');
			}, 2500);
			return;
		}

		try {
			setActive(true);
			const res = await fetch('/api/auth/register/', {
				method: 'POST',
				body: formData,
			});

			if (!res.ok) {
				setActive(false);
				setError(await res.text());
				setTimeout(() => {
					setError('');
				}, 2500);
			}

			const auth = getAuth(app);
			auth.setPersistence(inMemoryPersistence);

			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const idToken = await userCredential.user.getIdToken();
			const response = await fetch('/api/auth/signin/', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${idToken}`,
				},
			});

			if (response.redirected) {
				window.location.assign(response.url);
			}
			if (!response.ok) {
				setActive(false);
				setError(await response.text());
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
	};

	return (
		<>
			<button
				id="loginButton"
				type="button"
				onClick={handleSubmit}
				class={`w-full btn btn-primary ${
					active ? 'btn-disabled' : error ? 'btn-error' : ''
				}`}
			>
				<span id="loadingSpan" class={active ? 'loading' : ''}></span>
				Registrarse
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
