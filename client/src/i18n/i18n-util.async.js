// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
// @ts-check
/* eslint-disable */

/**
 * @typedef { import('./i18n-types').Locales } Locales
 * @typedef { import('./i18n-types').Translations } Translations
 */

import { initFormatters } from './formatters'

import { loadedFormatters, loadedLocales, locales } from './i18n-util'

const localeTranslationLoaders = {
	de: () => import('./de'),
	en: () => import('./en'),
	kr: () => import('./kr'),
}

/**
 * @param { Locales } locale
 * @param { Partial<Translations> } dictionary
 * @return { Translations }
 */
const updateDictionary = (locale, dictionary) =>
	loadedLocales[locale] = { ...loadedLocales[locale], ...dictionary }

/**
 * @param { Locales } locale
 * @return { Promise<Translations> }
 */
export const importLocaleAsync = async (locale) =>
	/** @type { Translations } */ (/** @type { unknown } */ ((await localeTranslationLoaders[locale]()).default))

/**
 * @param { Locales } locale
 * @return { Promise<void> }
 */
export const loadLocaleAsync = async (locale) => {
	updateDictionary(locale, await importLocaleAsync(locale))
	loadFormatters(locale)
}

export const loadAllLocalesAsync = () => Promise.all(locales.map(loadLocaleAsync))

/**
 * @param { Locales } locale
 * @return { void }
 */
export const loadFormatters = (locale) =>
	void (loadedFormatters[locale] = initFormatters(locale))
