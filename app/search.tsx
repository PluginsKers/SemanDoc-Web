"use client"

import React, { useRef, useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function Search({ disabled, searchValue, kValue }: { disabled?: boolean, searchValue?: string, kValue?: string }) {
	const { replace } = useRouter();
	const pathname = usePathname();
	const [inputSearchValue, setInputSearchValue] = useState(searchValue || '');
	const [inputKValue, setInputKValue] = useState(kValue || '');
	const [filterPanelOpen, setfilterPanelOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const inputRef = useRef<HTMLInputElement>(null);

	const handleFilterButtonClick = () => {
		setfilterPanelOpen(!filterPanelOpen);
	}

	const handleKSet = (_k: string, focus: boolean = false) => {
		if (kValue == _k && !focus) return;
		const params = new URLSearchParams(window.location.search);
		if (_k) {
			params.set('k', _k);
		} else {
			params.delete('k');
		}
		replace(`${pathname}?${params.toString()}`);
	}

	const handleKSetKeyDown = (e: any) => {
		if (e.key === 'Enter') {
			handleKSet(e.target.value, true);
		}
	};

	const handleSearchSet = (term: string, focus: boolean = false) => {
		if (searchValue == term && !focus) return;
		const params = new URLSearchParams(window.location.search);
		if (term) {
			params.set('q', term);
		} else {
			params.delete('q');
		}

		startTransition(() => {
			replace(`${pathname}?${params.toString()}`);
		});
	}

	const handleSearchKeyDown = (e: any) => {
		if (e.key === 'Enter') {
			handleSearchSet(e.target.value, true);
		}
	};

	return (
		<div className="flex flex-col text-sm mt-5 lg:flex-row lg:items-start lg:justify-between">
			<div className="relative lg:mr-5 lg:mb-0 lg:w-1/3">
				<label htmlFor="search" className="sr-only">
					检索
				</label>
				<div className="rounded-md shadow-sm">
					<div
						className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
						aria-hidden="true"
					>
						<MagnifyingGlassIcon
							className="mr-3 h-4 w-4 text-gray-400"
							aria-hidden="true"
						/>
					</div>
					<input
						type="text"
						name="search"
						id="search"
						disabled={disabled}
						className="block w-full rounded-md border border-gray-50 py-1.5 pl-9 pr-20 text-gray-900 placeholder:text-gray-400 sm:leading-6 focus:bg-gray-50 focus:border focus:border-gray-200"
						placeholder="检索内容..."
						spellCheck={false}
						value={inputSearchValue}
						ref={inputRef}
						onBlur={(e) => handleSearchSet(e.target.value)}
						onChange={(e) => setInputSearchValue(e.target.value)}
						onKeyDown={(e) => handleSearchKeyDown(e)}
					/>
				</div>

				{isPending && (
					<div className="absolute right-0 top-0 bottom-0 flex items-center justify-center">
						<svg
							className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							/>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
					</div>
				)}
			</div>
			<div className="relative mt-1 lg:mt-0 bg-white text-slate-700 rounded-md shadow-sm">
				{filterPanelOpen &&
					(
						<div className="px-3 py-3 h-full w-full">
							<div className="flex flex-row items-center justify-between pb-3 text-sm">
								<input
									id='k'
									type='number'
									value={inputKValue}
									spellCheck={false}
									placeholder='最大检索数量'
									className="w-full rounded-md py-2 px-3 text-gray-900 ring-1 ring-gray-100 shadow-sm placeholder:text-gray-300 focus:bg-gray-50"
									onBlur={(e) => handleKSet(e.target.value)}
									onChange={(e) => setInputKValue(e.target.value)}
									onKeyDown={(e) => handleKSetKeyDown(e)}
								/>
							</div>
							<button className="px-3 py-2 h-full w-full rounded-md bg-gray-50 ring-gray-100 ring-1 hover:bg-neutral-100" onClick={handleFilterButtonClick}>
								检索筛选
							</button>
						</div>
					)
					||
					(
						<button className="px-3 py-2 h-full w-full rounded-md hover:ring-1 hover:ring-slate-900/5 hover:bg-neutral-100" onClick={handleFilterButtonClick}>
							检索筛选
						</button>
					)}
			</div>
		</div>
	);
}
