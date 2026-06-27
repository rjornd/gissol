/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import ru from './ru.js';
import en from './en.js';

const STORAGE_KEY = 'gis-language';
const DEFAULT_LOCALE = 'ru';
const SUPPORTED_LOCALES = ['ru', 'en'];
const dictionaries = { ru, en };

const LanguageContext = createContext(null);

function normalizeLocale(locale) {
  return SUPPORTED_LOCALES.includes(locale) ? locale : null;
}

function baseSegments() {
  return (import.meta.env.BASE_URL || '/').split('/').filter(Boolean);
}

function pathSegments(pathname) {
  return pathname.split('/').filter(Boolean);
}

function getLocaleFromPath(pathname) {
  const segments = pathSegments(pathname);
  const base = baseSegments();
  const afterBase = base.length && base.every((segment, index) => segments[index] === segment)
    ? segments.slice(base.length)
    : segments;
  return normalizeLocale(afterBase[0]) || normalizeLocale(segments.find((segment) => SUPPORTED_LOCALES.includes(segment)));
}

function isRootPath(pathname) {
  const segments = pathSegments(pathname);
  const base = baseSegments();
  if (segments.length === 0) return true;
  return base.length > 0 && segments.length === base.length && base.every((segment, index) => segments[index] === segment);
}

function getStoredLocale() {
  try {
    return normalizeLocale(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

function setStoredLocale(locale) {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // localStorage can be unavailable in private or restricted contexts.
  }
}

function getInitialLocale() {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  const localeFromPath = getLocaleFromPath(window.location.pathname);
  if (localeFromPath) return localeFromPath;
  if (isRootPath(window.location.pathname)) return DEFAULT_LOCALE;
  return getStoredLocale() || DEFAULT_LOCALE;
}

function buildLocalizedPath(locale, { includeSearch = true, includeHash = true } = {}) {
  const nextLocale = normalizeLocale(locale) || DEFAULT_LOCALE;
  const segments = pathSegments(window.location.pathname);
  const base = baseSegments();
  const hasBase = base.length && base.every((segment, index) => segments[index] === segment);
  const prefix = hasBase ? base : [];
  const rest = hasBase ? segments.slice(base.length) : segments;
  const restWithoutLocale = normalizeLocale(rest[0]) ? rest.slice(1) : rest.filter((segment) => !normalizeLocale(segment));
  const nextSegments = [...prefix, nextLocale, ...restWithoutLocale];
  const pathname = `/${nextSegments.join('/')}`.replace(/\/+/g, '/');
  const search = includeSearch ? window.location.search : '';
  const hash = includeHash ? window.location.hash : '';
  return `${pathname}${search}${hash}`;
}

function ensureMetaDescription(content) {
  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'description');
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function ensureLink(rel, attributes) {
  const selector = attributes.hreflang
    ? `link[rel="${rel}"][hreflang="${attributes.hreflang}"]`
    : `link[rel="${rel}"]`;
  let link = document.querySelector(selector);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  Object.entries(attributes).forEach(([key, value]) => link.setAttribute(key, value));
}

function syncDocumentMeta(locale, t) {
  document.documentElement.lang = locale;
  document.title = t.meta.title;
  ensureMetaDescription(t.meta.description);

  const origin = window.location.origin;
  const canonicalPath = buildLocalizedPath(locale, { includeSearch: false, includeHash: false });
  ensureLink('canonical', { href: `${origin}${canonicalPath}` });
  ensureLink('alternate', { hreflang: 'ru', href: `${origin}${buildLocalizedPath('ru', { includeSearch: false, includeHash: false })}` });
  ensureLink('alternate', { hreflang: 'en', href: `${origin}${buildLocalizedPath('en', { includeSearch: false, includeHash: false })}` });
  ensureLink('alternate', { hreflang: 'x-default', href: `${origin}${buildLocalizedPath('ru', { includeSearch: false, includeHash: false })}` });
}

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(getInitialLocale);

  useEffect(() => {
    const onPopState = () => {
      setLocaleState(getLocaleFromPath(window.location.pathname) || (isRootPath(window.location.pathname) ? DEFAULT_LOCALE : getStoredLocale() || DEFAULT_LOCALE));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const setLocale = (nextLocale) => {
    const normalizedLocale = normalizeLocale(nextLocale) || DEFAULT_LOCALE;
    setStoredLocale(normalizedLocale);
    const nextPath = buildLocalizedPath(normalizedLocale);
    if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
    setLocaleState(normalizedLocale);
  };

  const t = dictionaries[locale] || dictionaries[DEFAULT_LOCALE];

  useEffect(() => {
    setStoredLocale(locale);
    syncDocumentMeta(locale, t);
  }, [locale, t]);

  const value = useMemo(() => ({
    locale,
    setLocale,
    t,
    localizedPath: (nextLocale) => buildLocalizedPath(nextLocale),
  }), [locale, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useI18n must be used inside LanguageProvider');
  }
  return context;
}
