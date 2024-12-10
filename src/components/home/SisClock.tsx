import { getTimeStamp } from '@db/utils';
import { useEffect, useState } from 'preact/hooks';

export default function SisClock({
	sistem_type,
	sistem,
}: {
	sistem_type: string;
	sistem: any;
}) {
	const [ahora, setAhora] = useState(getTimeStamp());
	const [key, setKey] = useState(obtenerKeyActual());

	function obtenerKeyActual() {
		const now = getTimeStamp().getTime();
		const keys = Object.keys(sistem);
		let key = keys[0];
		for (let i = 0; i < keys.length; i++) {
			const start = sistem[keys[i]].range[0];
			const end = sistem[keys[i]].range[1];
			if (now <= end) {
				if (now >= start) {
					key = keys[i];
					break;
				} else if (i > 0 && now < start && now > sistem[keys[i - 1]].range[1]) {
					key = `${keys[i - 1]} ~ ${keys[i]}`;
					break;
				}
			}
		}
		return key;
	}

	useEffect(() => {
		const interval = setInterval(() => {
			const nuevaHora = getTimeStamp();
			const nuevaKey = obtenerKeyActual();
			if (nuevaKey !== key) {
				setAhora(nuevaHora);
				setKey(nuevaKey);
			}
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return <p class="text-primary">{key}</p>;
}
