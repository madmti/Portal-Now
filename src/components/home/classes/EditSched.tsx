import type { tgetClassInfoRes, tgetSistemsRes } from '@lib/database';
import { days } from '@lib/time';
import { useState } from 'preact/hooks';

interface tState {
	mode: 'error' | 'saving' | 'edit' | 'none';
	error: string;
	show_modal: boolean;
	fields: tgetClassInfoRes[];
	sistem_idx: number;
}

export default function EditSched({
	time_sistems,
	sistem_id,
	initial_fields,
	class_name,
}: {
	time_sistems: tgetSistemsRes;
	sistem_id: number | null;
	initial_fields: tgetClassInfoRes[];
	class_name: string;
}) {
	const [state, setState] = useState<tState>({
		mode: 'none',
		error: '',
		show_modal: false,
		fields: initial_fields,
		sistem_idx: time_sistems.findIndex(
			(s) => s.id === (sistem_id === null ? -1 : sistem_id)
		),
	});

	function addField() {
		const day = Number(
			(document.getElementById('day') as HTMLSelectElement).value
		);
		const type = (document.getElementById('type') as HTMLSelectElement).value;
		const place = (document.getElementById('place') as HTMLInputElement).value;
		const key = (document.getElementById('key') as HTMLSelectElement).value;
		const sistem_idx = (
			document.getElementById('sistem_idx') as HTMLSelectElement
		).value;
		const sistem_name =
			sistem_idx !== '-1'
				? time_sistems[Number(sistem_idx)].name
				: 'Sin sistema';
		const sistem_id =
			sistem_idx !== '-1' ? time_sistems[Number(sistem_idx)].id : -1;
		if (!place || !key) return;
		const field: tState['fields'][0] = {
			sched_day: day,
			sched_type: type,
			sched_place: place,
			sistem_id: sistem_id,
			sistem_name: sistem_name,
			sistem_key: key,
		};
		setState((prev) => ({
			...prev,
			fields: [...prev.fields, field],
			show_modal: false,
		}));
	}

	function removeField(index: number) {
		setState((prev) => ({
			...prev,
			fields: prev.fields.filter((_, i) => i !== index),
		}));
	}

	async function saveSched() {
		setState((prev) => ({ ...prev, mode: 'saving' }));
		try {
			const response = await fetch('/api/home/updatesched/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					class_name: class_name,
					fields: state.fields,
				}),
			});
			if (response.redirected) {
				window.location.href = response.url;
			}
		} catch (e: any) {
			setState((prev) => ({ ...prev, mode: 'error', error: e.message }));
			setTimeout(() => {
				setState((prev) => ({ ...prev, mode: 'none', error: '' }));
			}, 2500);
		}
		setState((prev) => ({ ...prev, mode: 'none' }));
	}

	return (
		<>
			<label
				class="text-base flex justify-between items-center gap-2 w-full"
				for="horario"
			>
				<h1 class="text-2xl">Horarios</h1>
				{state.mode === 'saving' && <span class="loading"></span>}
				{state.mode !== 'saving' && (
					<div class="flex items-center gap-2">
						{state.mode === 'edit' && (
							<button
								type="button"
								class="btn btn-sm btn-primary"
								onClick={saveSched}
							>
								<span className="icon-[bx--save] text-xl" />
							</button>
						)}
						<button
							type="button"
							class={`btn btn-sm ${
								state.mode === 'edit' ? 'btn-error' : 'btn-primary btn-outline'
							}`}
							onClick={() => {
								setState((prev) => ({
									...prev,
									fields: prev.mode === 'edit' ? initial_fields : prev.fields,
									mode: prev.mode === 'edit' ? 'none' : 'edit',
								}));
							}}
						>
							{state.mode === 'edit' ? (
								<span class="icon-[ix--cancel] text-lg" />
							) : (
								<span class="icon-[material-symbols--edit]" />
							)}
						</button>
					</div>
				)}
			</label>
			<div className="overflow-x-auto">
				<table className="table">
					<thead>
						<tr>
							<th>Tipo</th>
							<th>Día</th>
							<th>Lugar</th>
							<th>Clave</th>
							<th>Sistema</th>
							{state.mode === 'edit' && <th />}
						</tr>
					</thead>
					<tbody>
						{state.fields.map((f, i) => (
							<tr>
								<th>{f.sched_type}</th>
								<th>{days[f.sched_day].substring(0, 3)}</th>
								<th>{f.sched_place}</th>
								<th>{f.sistem_key}</th>
								<th>{f.sistem_name}</th>
								{state.mode === 'edit' && (
									<th>
										<button
											type="button"
											className="btn btn-outline btn-sm btn-error sm:btn-wide max-w-20"
											onClick={() => removeField(i)}
										>
											<span class="icon-[material-symbols--delete]" />
										</button>
									</th>
								)}
							</tr>
						))}
						{state.mode === 'edit' && (
							<tr>
								<th>-</th>
								<th>-</th>
								<th>-</th>
								<th>-</th>
								<th>-</th>
								<th>
									<button
										type="button"
										className="btn btn-sm btn-outline btn-primary sm:btn-wide max-w-20"
										onClick={() =>
											setState((prev) => ({ ...prev, show_modal: true }))
										}
									>
										<span class="text-lg icon-[material-symbols--add]" />
									</button>
								</th>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			<div
				id="add-schedule"
				class={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col p-8 gap-4 bg-neutral rounded-lg ${
					state.show_modal ? '' : 'hidden'
				}`}
			>
				<h1 className="text-2xl mb-2">Horario</h1>
				<div className="flex items-center gap-2 justify-between">
					<label htmlFor="type">Tipo</label>
					<select
						id="type"
						name="type"
						className="input input-bordered hover:input-primary max-w-full"
					>
						<option value="Catedra">Cátedra</option>
						<option value="Laboratorio">Laboratorio</option>
						<option value="Ayudantia">Ayudantia</option>
						<option value="Taller">Taller</option>
					</select>
				</div>
				<div className="flex items-center gap-2 justify-between">
					<label htmlFor="day">Día</label>
					<select
						id="day"
						name="day"
						className="input input-bordered hover:input-primary max-w-full"
					>
						{days.map((d, i) => (
							<option value={i}>{d}</option>
						))}
					</select>
				</div>
				<div className="flex items-center gap-2 justify-between">
					<label htmlFor="place">Lugar</label>
					<input
						type="text"
						id="place"
						name="place"
						placeholder="Ej: Sala 1, P101, etc."
						className="input input-bordered hover:input-primary max-w-full ml-4"
					/>
				</div>
				<div className="flex items-center gap-2 justify-between">
					<label htmlFor="sistem_idx">Sistema</label>
					<select
						id="sistem_idx"
						name="sistem_idx"
						className="input input-bordered hover:input-primary max-w-full"
						onChange={(e) =>
							setState((prev) => ({
								...prev,
								sistem_idx: Number(e.currentTarget.value),
							}))
						}
					>
						<option value="-1">Sin sistema</option>
						{time_sistems.map((s, idx) => (
							<option value={idx} selected={idx === state.sistem_idx}>
								{s.name}
							</option>
						))}
					</select>
				</div>
				{state.sistem_idx !== -1 && (
					<div className="flex items-center gap-2 justify-between">
						<label htmlFor="key">Clave</label>
						<select
							id="key"
							name="key"
							className="input input-bordered hover:input-primary max-w-full"
						>
							{time_sistems[state.sistem_idx].sorted_keys.map((k) => (
								<option value={k}>{k}</option>
							))}
						</select>
					</div>
				)}
				{state.sistem_idx === -1 && (
					<div className="flex items-center gap-2 justify-between">
						<label htmlFor="key">Clave</label>
						<input
							type="time"
							id="key"
							name="key"
							className="input input-bordered hover:input-primary max-w-full ml-4"
						/>
					</div>
				)}
				<button type="button" className="btn btn-primary" onClick={addField}>
					Agregar
				</button>
			</div>
			<span
				onClick={() => setState((prev) => ({ ...prev, show_modal: false }))}
				className={`absolute w-full h-full top-0 left-0 z-20 bg-black bg-opacity-70 cursor-pointer ${
					state.show_modal ? '' : 'hidden'
				}`}
			/>
		</>
	);
}
