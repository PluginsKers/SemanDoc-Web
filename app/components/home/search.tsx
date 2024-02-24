"use client"

import React, { useRef, useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function Search({ disabled, searchValue, kValue, tagsValue }: { disabled?: boolean, searchValue?: string, kValue?: string, tagsValue?: string[] }) {
	const { replace } = useRouter();
	const pathname = usePathname();
	const [tags, setTags] = useState<string[]>(tagsValue || []);
	const [tagValue, setTagValue] = useState('');
	const [inputSearchValue, setInputSearchValue] = useState(searchValue || '');
	const [inputKValue, setInputKValue] = useState(kValue || '');
	const [filterPanelOpen, setfilterPanelOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const inputRef = useRef<HTMLInputElement>(null);

	const handleTagChange = (e: any) => {
		setTagValue(e.target.value);
	};

	const handleTagKeyDown = (e: any) => {
		if (e.key === 'Enter') {
			if (tagValue.length == 0) return;
			for (let i = 0; i < tags.length; i++) {
				if (tags[i] == tagValue) return;
			}
			let nTags = [...tags, tagValue]
			setTags(nTags);
			const params = new URLSearchParams(window.location.search);
			if (nTags.length > 0) {
				params.set('t', nTags.join(','));
			} else {
				params.delete('t');
			}
			replace(`${pathname}?${params.toString()}`);
			setTagValue('');
		}
	};

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

	const handleTagDelete = (index: any) => {
		const updatedLabels = tags.filter((_, i) => i !== index);
		const params = new URLSearchParams(window.location.search);
		if (updatedLabels.length > 0) {
			params.set('t', updatedLabels.join(','));
		} else {
			params.delete('t');
		}
		replace(`${pathname}?${params.toString()}`);
		setTags(updatedLabels);
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
			<div className="relative mt-1 lg:mt-0 bg-white text-slate-700 rounded-md shadow-sm lg:w-2/3">
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
							<div className='mb-3'>
								<input
									type="text"
									value={tagValue}
									onChange={handleTagChange}
									onKeyDown={handleTagKeyDown}
									className="w-full mb-3 rounded-md py-2 px-3 text-gray-900 ring-1 ring-gray-100 shadow-sm placeholder:text-gray-300 focus:bg-gray-50"
									placeholder="按下回车添加标签"
								/>
								<div className="relative overflow-hidden rounded-sm border border-dashed border-gray-400/40 opacity-75 flex flex-row items-center flex-wrap p-1 pb-0">
									{tags.length > 0 &&
										tags.map((label, index) => (
											<span key={index} onClick={() => handleTagDelete(index)} className="cursor-pointer shadow-sm select-none inline-block bg-slate-600 hover:bg-slate-500 rounded-sm px-1.5 py-1 text-white mr-1 mb-1">
												{label}
											</span>
										))
										||
										(<div>
											<svg className="absolute inset-0 h-full w-full stroke-gray-900/10 opacity-0 hover:opacity-100" fill="none">
												<defs>
													<pattern id="pattern-d09edaee-fc6a-4f25-aca5-bf9f5f77e14a" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
														<path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
													</pattern>
												</defs>
												<rect stroke="none" fill="url(#pattern-d09edaee-fc6a-4f25-aca5-bf9f5f77e14a)" width="100%" height="100%"></rect>
											</svg>
											{/* <div className='absolute text-center top-0 left-0 text-[12px] text-gray-900/50 tracking-[.8em] h-full w-full flex flex-col justify-center select-none text-nowrap z-0'>请添加至少一个标签</div> */}
											<span className="relative shadow-sm select-none inline-block bg-gray-400/80 rounded-sm px-1.5 py-1 text-white mr-1 mb-1 z-1">
												请添加标签
											</span>
										</div>)
									}
								</div>
							</div>
							<button className="select-none px-3 py-2 h-full w-full rounded-md bg-gray-50 ring-gray-100 ring-1 hover:bg-neutral-100" onClick={handleFilterButtonClick}>
								检索筛选
							</button>
						</div>
					)
					||
					(
						<button className="select-none px-3 py-2 h-full w-full rounded-md hover:ring-1 hover:ring-slate-900/5 hover:bg-neutral-100" onClick={handleFilterButtonClick}>
							检索筛选
						</button>
					)}
			</div>
		</div>
	);
}
