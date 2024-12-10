import type { tgetSistemsRes } from '@lib/database';
import { useEffect, useState } from 'preact/hooks';

export default function ChooseSistem({ sistems }: { sistems: tgetSistemsRes }) {
	const [selectedSistem, setSelectedSistem] = useState(-1);

	return (
		<>
			<input
				type="hidden"
				name="sistem_id"
				id="sistem_id"
				value={
					selectedSistem === -1
						? 'null'
						: JSON.stringify(sistems.at(selectedSistem)?.id)
				}
			/>
			<div class="flex items-center justify-between">
				<h3 class="text-lg">Sistema de horarios</h3>
				<select
					name="sistem_name"
					id="sistem_name"
					class="select select-bordered w-full max-w-xs"
					onChange={(e) => setSelectedSistem(Number(e.currentTarget.value))}
				>
					<option value={-1}>Sin sistema</option>
					{sistems.map((sistem, idx) => (
						<option value={idx}>{sistem.name}</option>
					))}
				</select>
			</div>
			{selectedSistem === -1 && (
				<p class="text-lg text-gray-500 mt-4">
					No has seleccionado un sistema, puedes continuar sin un sistema de
					horarios, seleccionar uno o crear uno personalizado mas tarde.
					<br />
					<br />
					No elegir un sistema no tiene efectos negativos en la aplicación,
					simplemente se veran los horarios cronologicamente segun la hora.
				</p>
			)}
			{selectedSistem !== -1 && (
				<>
					<span class="badge badge-primary">
						{sistems.at(selectedSistem)?.sistem_type}
					</span>
					<div class="overflow-x-auto">
						<table class="table">
							<thead>
								<tr>
									<th>Nombre</th>
									<th>Horarios</th>
								</tr>
							</thead>
							<tbody>
								{Object.entries(sistems.at(selectedSistem)?.sistem ?? {}).map(
									([key, value]) => {
										const start = new Date(value.range[0])
											.toTimeString()
											.split(' ')[0];
										const end = new Date(value.range[1])
											.toTimeString()
											.split(' ')[0];
										return (
											<tr>
												<td>{key}</td>
												<td>
													{start} - {end}
												</td>
											</tr>
										);
									}
								)}
							</tbody>
						</table>
					</div>
				</>
			)}
		</>
	);
}
