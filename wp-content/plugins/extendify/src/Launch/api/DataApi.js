import { PATTERNS_HOST, AI_HOST, IMAGES_HOST } from '@constants';
import { getHeadersAndFooters } from '@launch/api/WPApi';
import { Axios as api } from '@launch/api/axios';
import { useUserSelectionStore } from '@launch/state/user-selections';

// Optionally add items to request body
const allowList = [
	'partnerId',
	'devbuild',
	'version',
	'siteId',
	'wpLanguage',
	'wpVersion',
	'siteProfile',
];

const extraBody = {
	...Object.fromEntries(
		Object.entries(window.extSharedData).filter(([key]) =>
			allowList.includes(key),
		),
	),
};

const fetchTemplates = async (type, siteType, otherData = {}) => {
	const { showLocalizedCopy, allowedPlugins } = window.extSharedData;
	const { goals, getGoalsPlugins } = useUserSelectionStore.getState();
	const plugins = getGoalsPlugins();
	const otherDataProcessed = Object.entries(otherData).reduce(
		(result, [key, value]) => {
			if (value == null) result;
			return {
				...result,
				[key]: typeof value === 'object' ? JSON.stringify(value) : value,
			};
		},
		{},
	);

	const res = await fetch(`${PATTERNS_HOST}/api/${type}-templates`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			...extraBody,
			siteType: siteType?.slug,
			goals: JSON.stringify(goals?.length ? goals : []),
			plugins: JSON.stringify(plugins?.length ? plugins : []),
			showLocalizedCopy: !!showLocalizedCopy,
			allowedPlugins: JSON.stringify(allowedPlugins ?? []),
			...otherDataProcessed,
		}),
	});

	if (!res.ok) throw new Error('Bad response from server');

	return await res.json();
};

export const getHomeTemplates = async ({
	siteType,
	siteStructure,
	siteProfile,
	siteStrings,
	siteImages,
	siteStyles,
	goals,
	siteObjective,
}) => {
	const styles = await fetchTemplates('home', siteType, {
		siteStructure,
		siteProfile,
		siteStrings,
		siteImages,
		siteStyles,
		goals,
		siteObjective,
	});
	const { headers, footers } = await getHeadersAndFooters();
	if (!styles?.length) {
		throw new Error('Could not get styles');
	}
	return styles.map((template, index) => {
		// Cycle through the headers and footers
		const header = headers[index % headers.length];
		const footer = footers[index % footers.length];
		return {
			...template,
			headerCode: header?.content?.raw?.trim() ?? '',
			footerCode: footer?.content?.raw?.trim() ?? '',
		};
	});
};

export const getPageTemplates = async ({
	siteType,
	siteStructure,
	siteStrings,
	siteImages,
	siteStyle,
}) => {
	const { siteInformation, siteProfile } = useUserSelectionStore.getState();
	const pages = await fetchTemplates('page', siteType, {
		siteInformation,
		siteStructure,
		siteStrings,
		siteImages,
		siteStyle,
		siteProfile,
	});
	if (!pages?.recommended) {
		throw new Error('Could not get pages');
	}
	return {
		recommended: pages.recommended.map(({ slug, ...rest }) => ({
			...rest,
			slug,
			id: slug,
		})),
		optional: pages.optional.map(({ slug, ...rest }) => ({
			...rest,
			slug,
			id: slug,
		})),
	};
};

export const getGoals = async ({
	title,
	siteTypeSlug,
	siteProfile,
	siteObjective,
}) => {
	const goals = await api.get('launch/goals', {
		params: {
			title,
			site_type: siteTypeSlug,
			site_profile: siteProfile,
			site_objective: siteObjective,
			site_id: window.extSharedData.siteId,
		},
	});
	if (!goals?.data?.length) {
		throw new Error('Could not get goals');
	}
	return goals.data;
};

export const generateCustomPatterns = async (page, userState, siteProfile) => {
	const res = await fetch(`${AI_HOST}/api/patterns`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			...extraBody,
			page,
			userState,
			siteProfile,
		}),
	});

	if (!res.ok) throw new Error('Bad response from server');
	return await res.json();
};

export const getLinkSuggestions = async (pageContent, availablePages) => {
	const abort = new AbortController();
	const timeout = setTimeout(() => abort.abort(), 15000);
	const { siteType } = useUserSelectionStore.getState();
	try {
		const res = await fetch(`${AI_HOST}/api/link-pages`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				...extraBody,
				siteType: siteType?.slug,
				pageContent,
				availablePages,
			}),
			signal: abort.signal,
		});
		if (!res.ok) throw new Error('Bad response from server');
		return await res.json();
	} catch (error) {
		// fail gracefully
		return {};
	} finally {
		clearTimeout(timeout);
	}
};

export const getSiteProfile = async ({ title, description }) => {
	const url = `${AI_HOST}/api/site-profile`;
	const method = 'POST';
	const headers = { 'Content-Type': 'application/json' };
	const body = JSON.stringify({
		...extraBody,
		title,
		description,
	});
	const fallback = {
		aiSiteType: null,
		aiSiteCategory: null,
		aiDescription: null,
		aiKeywords: [],
	};
	let response;
	try {
		response = await fetch(url, { method, headers, body });
	} catch (error) {
		// try one more time
		response = await fetch(url, { method, headers, body });
	}
	if (!response.ok) return fallback;
	let data;
	try {
		data = await response.json();
	} catch (error) {
		return fallback;
	}
	return data?.aiSiteType ? data : fallback;
};

export const getSiteStrings = async (siteProfile) => {
	const url = `${AI_HOST}/api/site-strings`;
	const method = 'POST';
	const headers = { 'Content-Type': 'application/json' };
	const body = JSON.stringify({ ...extraBody, siteProfile });
	const fallback = { aiHeaders: [], aiBlogTitles: [] };
	let response;
	try {
		response = await fetch(url, { method, headers, body });
	} catch (error) {
		// try one more time
		response = await fetch(url, { method, headers, body });
	}
	if (!response.ok) return fallback;
	let data;
	try {
		data = await response.json();
	} catch (error) {
		return fallback;
	}
	return data?.aiHeaders ? data : fallback;
};

export const getSiteImages = async (siteProfile) => {
	const { aiSiteType, aiSiteCategory, aiDescription, aiKeywords } = siteProfile;
	const { siteInformation } = useUserSelectionStore.getState();
	const search = new URLSearchParams({
		aiSiteType,
		aiSiteCategory,
		aiDescription,
		aiKeywords,
		...extraBody,
		source: 'launch',
	});
	if (siteInformation?.title) search.append('title', siteInformation.title);
	const url = `${IMAGES_HOST}/api/search?${search}`;
	const method = 'GET';
	const headers = { 'Content-Type': 'application/json' };
	const fallback = { siteImages: [] };
	let response;
	try {
		response = await fetch(url, { method, headers });
	} catch (error) {
		// try one more time
		response = await fetch(url, { method, headers });
	}
	if (!response.ok) return fallback;
	let data;
	try {
		data = await response.json();
	} catch (error) {
		return fallback;
	}
	return data?.siteImages ? data : fallback;
};

export const getSiteStyles = async ({ title, siteProfile }) => {
	const request = new Request(`${AI_HOST}/api/styles`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ ...extraBody, title, siteProfile }),
	});

	let response;

	try {
		response = await fetch(request);
	} catch (error) {
		// try one more time
		response = await fetch(request);
	}

	const fallback = [];

	if (!response.ok) {
		return fallback;
	}

	try {
		return await response.json();
	} catch (_) {
		return fallback;
	}
};

export const getSiteLogo = async (objectName) => {
	const url = `${AI_HOST}/api/site-profile/generate-logo`;
	const method = 'POST';
	const headers = { 'Content-Type': 'application/json' };
	const siteId = window.extSharedData?.siteId ?? '';
	const partnerId = window.extSharedData?.partnerId ?? '';
	const showAILogo = window.extSharedData?.showAILogo ?? false;
	const fallback =
		'https://images.extendify-cdn.com/demo-content/logos/ext-custom-logo-default.webp';

	if (!showAILogo) {
		return fallback;
	}

	if (!siteId || !partnerId || !objectName) {
		throw new Error(
			'Missing required parameter (siteId, partnerId or objectName)',
		);
	}

	const body = JSON.stringify({ objectName, siteId, partnerId });

	let response;
	try {
		response = await fetch(url, { method, headers, body });
		if (!response.ok) throw new Error('Bad response from server');
	} catch (error) {
		response = await fetch(url, { method, headers, body });
	}

	if (!response.ok) return fallback;

	try {
		const data = await response.json();
		return data?.logoUrl ?? fallback;
	} catch (error) {
		return fallback;
	}
};
