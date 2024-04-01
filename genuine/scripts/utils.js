/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/*
 * ------------------------------------------------------------
 * Edit below at your own risk
 * ------------------------------------------------------------
 */

/**
 * The decision engine for where to get Milo's libs from.
 */

export const [setLibs, getLibs] = (() => {
  let libs;
  return [
    (prodLibs, force = false) => {
      if (force) {
        libs = prodLibs;
        return libs;
      }
      const { hostname } = window.location;
      if (
        !hostname.includes('hlx.page') &&
        !hostname.includes('hlx.live') &&
        !hostname.includes('localhost')
      ) {
        libs = prodLibs;
        return libs;
      }
      const branch =
        new URLSearchParams(window.location.search).get('milolibs') || 'main';
      if (branch === 'local') {
        libs = 'http://localhost:6456/libs';
        return libs;
      }
      if (branch.indexOf('--') > -1) {
        libs = `https://${branch}.hlx.live/libs`;
        return libs;
      }
      libs = `https://${branch}--milo--adobecom.hlx.live/libs`;
      return libs;
    },
    () => libs,
  ];
})();

const miloLibs = setLibs('/libs');

const { createTag, localizeLink } = await import(`${miloLibs}/utils/utils.js`);
export { createTag, localizeLink };

export async function isTokenValid() {
  const urlParams = new URLSearchParams(window.location.search);
  const gtoken = urlParams.get('gtoken');
  const gid = urlParams.get('gid');
  return new Promise(function(resolve) {
    setTimeout(function() {
        resolve(true);
    }, 300);
});
}

export function getParamsPlaceholders() {
  const urlParams = new URLSearchParams(window.location.search);
  const gtoken = urlParams.get('gtoken');
  const gid = urlParams.get('gid');
  return {
    gid,
    gtoken,
  };
}

export async function getConfig() {
  const DOT_MILO = '/.milo/config.json';
  const urlParams = new URLSearchParams(window.location.search);
  const owner = urlParams.get('owner') || 'adobecom';
  const repo = urlParams.get('repo') || 'milo';
  const origin = `https://main--${repo}--${owner}.hlx.page`;
  let configs = {};
  try {
    const resp = await fetch(`${origin}${DOT_MILO}`);
    const json = await resp.json();
    configs = json.configs?.data;
  } catch (err) {
    console.log(err, 'error');
  }
  return configs;
}
