import React, { MouseEventHandler } from 'react'

interface IProps {
	name: string;
	onClick: MouseEventHandler<HTMLButtonElement>;
}

function FormBtn({onClick, name}: IProps) {
  return (
		<button
			onClick={onClick}
			type="submit"
			className="rounded-md w-full my-4 bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
			{name}
		</button>
	);
}

export default FormBtn