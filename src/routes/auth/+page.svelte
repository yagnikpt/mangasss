<script lang="ts">
	import { enhance } from '$app/forms';
	import { Input } from '$lib/components/ui/input';
	export let form;
</script>

<svelte:head>
	<title>Sign in/up</title>
	<meta name="description" content="Sign in or sign up into your Mangasss account." />
</svelte:head>

<main class="h-dvh flex justify-center items-center">
	<div class="mt-7 rounded-xl shadow-sm bg-neutral-800 border-gray-700 w-full max-w-sm mx-auto">
		<div class="p-4 sm:p-7">
			<div class="text-center">
				<h1 class="block text-2xl font-bold text-white">Sign in / Sign up</h1>
			</div>
			<div class="mt-5">
				<!-- Form -->
				<form use:enhance action="?/login" method="post">
					<div class="grid gap-y-4 mt-8">
						<!-- Form Group -->
						<div>
							<label for="email" class="block text-sm mb-2 text-white">Email address</label>
							<Input
								type="email"
								id="email"
								name="email"
								class="py-3 px-4 block w-full rounded-lg text-sm focus:border-neutral-500 disabled:opacity-50 disabled:pointer-events-none bg-neutral-900 border-gray-700 text-gray-400 focus:ring-gray-600"
								required
							/>
							<p class="hidden text-xs text-red-600 mt-2" id="email-error">
								Please include a valid email address so we can get back to you
							</p>
						</div>
						<div>
							<div class="flex justify-between items-center">
								<label for="password" class="block text-sm mb-2 dark:text-white">Password</label>
							</div>
							<Input
								type="password"
								id="password"
								name="password"
								class="py-3 px-4 block w-full rounded-lg text-sm focus:border-neutral-500 disabled:opacity-50 disabled:pointer-events-none bg-neutral-900 border-gray-700 text-gray-400 focus:ring-gray-600"
								required
							/>
							{#if form?.message}
								<p class="text-xs text-red-600 mt-2">
									{form?.message}
								</p>
							{/if}
						</div>
						<div class="flex items-center gap-2">
							<button
								type="submit"
								class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm rounded-md font-medium border border-transparent bg-neutral-300 text-black hover:bg-neutral-200 disabled:opacity-50 disabled:pointer-events-none"
								>Sign in</button
							>
							<button
								formaction="?/register"
								class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-transparent bg-neutral-700 text-white hover:bg-neutral-600 disabled:opacity-50 disabled:pointer-events-none"
								>Sign Up</button
							>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</main>
