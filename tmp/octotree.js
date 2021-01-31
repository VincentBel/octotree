const TEMPLATE = '<div>\n' +
    '  <nav class="octotree-sidebar">\n' +
    '    <div class="octotree-toggle">\n' +
    '      <i class="octotree-toggle-icon" role="button"></i> <span>Octotree</span>\n' +
    '\n' +
    '      <div class="popup">\n' +
    '        <div class="arrow"></div>\n' +
    '        <div class="content">\n' +
    '          Hi there, this is Octotree. Move mouse over this button to display the code tree. You can also press the\n' +
    '          shortkey <kbd>cmd shift s</kbd> (or <kbd>ctrl shift s</kbd>).\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="octotree-main-icons">\n' +
    '      <a class="octotree-pin" data-store="PINNED">\n' +
    '        <span class="tooltipped tooltipped-s" aria-label="Pin this sidebar"> <i class="octotree-icon-pin"></i> </span>\n' +
    '      </a>\n' +
    '\n' +
    '      <a class="octotree-settings">\n' +
    '        <span class="tooltipped tooltipped-s" aria-label="Settings"> <i class="octotree-icon-settings"></i> </span>\n' +
    '      </a>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="octotree-views">\n' +
    '      <div class="octotree-view octotree-tree-view current">\n' +
    '        <div class="octotree-view-header"></div>\n' +
    '        <div class="octotree-view-body"></div>\n' +
    '        <a class="octotree-spin"> <span class="octotree-spin--loader"></span> </a>\n' +
    '      </div>\n' +
    '\n' +
    '      <div class="octotree-view octotree-error-view">\n' +
    '        <div class="octotree-view-header octotree-header-text-top"></div>\n' +
    '        <form class="octotree-view-body"><div class="message"></div></form>\n' +
    '      </div>\n' +
    '\n' +
    '      <div class="octotree-view octotree-settings-view">\n' +
    '        <div class="octotree-view-header octotree-header-text-top">Settings</div>\n' +
    '        <form class="octotree-view-body">\n' +
    '          <div>\n' +
    '            <label>GitHub access token</label>\n' +
    '            <div class="octotree-token-actions">\n' +
    '              <a class="octotree-create-token" target="_blank" tabindex="-1"\n' +
    '                ><!--\n' +
    '                --><span class="tooltipped tooltipped-n" aria-label="Generate new token"\n' +
    '                  ><i class="octotree-icon-key"></i></span\n' +
    '                ><!--\n' +
    '              --></a>\n' +
    '              <a\n' +
    '                class="octotree-help"\n' +
    '                href="https://github.com/ovity/octotree#access-token"\n' +
    '                target="_blank"\n' +
    '                tabindex="-1"\n' +
    '              >\n' +
    '                <span class="tooltipped tooltipped-n" aria-label="Learn more">\n' +
    '                  <i class="octotree-icon-help"></i>\n' +
    '                </span>\n' +
    '              </a>\n' +
    '            </div>\n' +
    '            <input type="text" class="form-control input-block" data-store="TOKEN" />\n' +
    '            <div class="octotree-disclaimer text-gray">Token is stored in local storage</div>\n' +
    '          </div>\n' +
    '\n' +
    '          <div>\n' +
    '            <div>\n' +
    '              <label>Hotkeys</label>\n' +
    '              <div class="octotree-token-actions">\n' +
    '                <a class="octotree-help" href="https://github.com/ovity/octotree#hotkeys" target="_blank" tabindex="-1">\n' +
    '                  <span class="tooltipped tooltipped-n" aria-label="Learn more">\n' +
    '                    <i class="octotree-icon-help"></i>\n' +
    '                  </span>\n' +
    '                </a>\n' +
    '              </div>\n' +
    '            </div>\n' +
    '            <input\n' +
    '              type="text"\n' +
    '              autocomplete="off"\n' +
    '              spellcheck="false"\n' +
    '              autocapitalize="off"\n' +
    '              class="form-control"\n' +
    '              data-store="HOTKEYS"\n' +
    '            />\n' +
    '          </div>\n' +
    '\n' +
    '          <div>\n' +
    '            <label><input type="checkbox" data-store="HOVEROPEN" /> <span>Show sidebar on hover</span></label>\n' +
    '          </div>\n' +
    '          <div>\n' +
    '            <label><input type="checkbox" data-store="ICONS" /> <span>Show file-type icons</span></label>\n' +
    '          </div>\n' +
    '          <div>\n' +
    '            <label><input type="checkbox" data-store="LAZYLOAD" /> <span>Lazy-load code tree</span></label>\n' +
    '            <span class="octotree-disclaimer is-margin-left text-gray">Speed up large repositories</span>\n' +
    '          </div>\n' +
    '\n' +
    '          <div><button class="btn btn-primary">Apply settings</button></div>\n' +
    '        </form>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="octotree-footer"></div>\n' +
    '  </nav>\n' +
    '</div>\n' +
    ''
// Regexps from https://github.com/shockie/node-iniparser
const INI_SECTION = /^\s*\[\s*([^\]]*)\s*\]\s*$/;
const INI_COMMENT = /^\s*;.*$/;
const INI_PARAM = /^\s*([\w\.\-\_]+)\s*=\s*(.*?)\s*$/;
const SEPARATOR = /\r\n|\r|\n/;

function parseGitmodules(data) {
  if (!data) return;

  const submodules = {};
  const lines = data.split(SEPARATOR);
  let lastPath;

  lines.forEach((line) => {
    let match;
    if (INI_SECTION.test(line) || INI_COMMENT.test(line) || !(match = line.match(INI_PARAM))) {
      return;
    }

    if (match[1] === 'path') lastPath = match[2];
    else if (match[1] === 'url') submodules[lastPath] = match[2];
  });

  return submodules;
}

function parallel(arr, iter, done) {
  var total = arr.length;
  if (total === 0) return done();

  arr.forEach((item) => {
    iter(item, finish);
  });

  function finish() {
    if (--total === 0) done();
  }
}

function isSafari() {
  return typeof safari !== 'undefined' && safari.self && typeof safari.self.addEventListener === 'function';
}

function isValidTimeStamp(timestamp) {
  return !isNaN(parseFloat(timestamp)) && isFinite(timestamp);
}

window.isSafari = isSafari;
window.isValidTimeStamp = isValidTimeStamp;

let $dummyDiv;

window.deXss = (str) => {
  $dummyDiv = $dummyDiv || $('<div></div>');

  return $dummyDiv.text(str).html();
}

// Add custom JS Tree Plugins here

/**
 * Mimic logic from JSTree
 * https://github.com/vakata/jstree/blob/master/src/misc.js#L148
 *
 * Plugin truncate path name
 */
(function($) {
  'use strict';
  $.jstree.defaults.truncate = $.noop;
  $.jstree.plugins.truncate = function(opts, parent) {
    this.redraw_node = function(obj, deep, callback, force_draw) {
      obj = parent.redraw_node.call(this, obj, deep, callback, force_draw);
      if (obj) {
        $(obj)
          .find('.jstree-anchor')
          .contents()
          .filter(function() {
            // Get text node which is path name
            return this.nodeType === 3;
          })
          .wrap('<div style="overflow: hidden;text-overflow: ellipsis;"></div>')
          .end();
      }

      return obj;
    };
  };
})($);

const NODE_PREFIX = 'octotree';
const ADDON_CLASS = 'octotree';
const SHOW_CLASS = 'octotree-show';
const PINNED_CLASS = 'octotree-pinned';

const STORE = {
  TOKEN: 'octotree.token.perhost',
  HOVEROPEN: 'octotree.hover_open',
  HOTKEYS: 'octotree.hotkeys',
  ICONS: 'octotree.icons',
  LAZYLOAD: 'octotree.lazyload',
  POPUP: 'octotree.popup_shown',
  WIDTH: 'octotree.sidebar_width',
  SHOWN: 'octotree.sidebar_shown',
  PINNED: 'octotree.sidebar_pinned',
  HUGE_REPOS: 'octotree.huge_repos'
};

const DEFAULTS = {
  TOKEN: {},
  HOVEROPEN: true,
  LAZYLOAD: false,
  HOTKEYS: '⌘+⇧+s, ⌃+⇧+s',
  ICONS: true,
  POPUP: false,
  WIDTH: 232,
  SHOWN: false,
  PINNED: false,
  HUGE_REPOS: {}
};

const EVENT = {
  TOGGLE: 'octotree:toggle',
  TOGGLE_PIN: 'octotree:pin',
  LOC_CHANGE: 'octotree:location',
  LAYOUT_CHANGE: 'octotree:layout',
  REQ_START: 'octotree:start',
  REQ_END: 'octotree:end',
  STORE_CHANGE: 'octotree:storeChange',
  VIEW_READY: 'octotree:ready',
  VIEW_CLOSE: 'octotree:close',
  VIEW_SHOW: 'octotree:show',
  FETCH_ERROR: 'octotree:error',
  SIDEBAR_HTML_INSERTED: 'octotree:sidebarHtmlInserted',
  REPO_LOADED: 'octotree:repoLoaded'
};

window.STORE = STORE;
window.DEFAULTS = DEFAULTS;
window.EVENT = EVENT;

class ExtStore {
  constructor(values, defaults) {
    this._isSafari = isSafari();
    this._siteDomain = this._getCurrentSiteDomain();
    this._tempChanges = {};

    if (!this._isSafari) {
      this._setInExtensionStorage = promisify(chrome.storage.local, 'set');
      this._getInExtensionStorage = promisify(chrome.storage.local, 'get');
      this._removeInExtensionStorage = promisify(chrome.storage.local, 'remove');
    }

    // Initialize default values
    this._init = Promise.all(
      Object.keys(values).map(async (key) => {
        const existingVal = await this._innerGet(values[key]);
        if (existingVal == null) {
          await this._innerSet(values[key], defaults[key]);
        }
      })
    ).then(() => {
      this._init = null;
      this._setupOnChangeEvent();
    });
  }

  _setupOnChangeEvent() {
    window.addEventListener('storage', (evt) => {
      if (this._isOctotreeKey(evt.key)) {
        this._notifyChange(evt.key, _parse(evt.oldValue), _parse(evt.newValue));
      }
    });

    if (!this._isSafari) {
      chrome.storage.onChanged.addListener((changes) => {
        Object.entries(changes).forEach(([key, change]) => {
          if (this._isOctotreeKey(key)) {
            this._notifyChange(key, change.oldValue, change.newValue);
          }
        });
      });
    }
  }

  _isOctotreeKey(key) {
    return key.startsWith('octotree');
  }

  // Debounce and group the trigger of EVENT.STORE_CHANGE because the
  // changes are all made one by one
  _notifyChange(key, oldVal, newVal) {
    this._tempTimer && clearTimeout(this._tempTimer);
    this._tempChanges[key] = [oldVal, newVal];
    this._tempTimer = setTimeout(() => {
      $(this).trigger(EVENT.STORE_CHANGE, this._tempChanges);
      this._tempTimer = null;
      this._tempChanges = {};
    }, 50);
  }

  // Public
  async set(key, value) {
    if (this._init) await this._init;
    return this._innerSet(key, value);
  }

  async get(key) {
    if (this._init) await this._init;
    const value = await this._innerGet(key);
    
    if (this._isPerHost(key)) {
      return value[this._siteDomain];
    }

    return value;
  }

  async remove(key) {
    if (this._init) await this._init;
    return this._innerRemove(key);
  }

  async setIfNull(key, val) {
    const existingVal = await this.get(key);
    if (existingVal == null) {
      await this.set(key, val);
    }
  }

  // Private
  async _innerGet (key) {
    const result = this._isSafari
      ? await this._getLocal(key)
      : await this._getInExtensionStorage(key);
      
    return result[key];
  }

  async _innerSet (key, value) {
    const currentStore = await this._innerGet(key);
    const payload = {[key]: value};

    if (this._isPerHost(key) && currentStore) {
      currentStore[this._siteDomain] = value;
      payload[key] = currentStore;  
    }

    return this._isSafari 
      ? this._setLocal(payload) 
      : this._setInExtensionStorage(payload);
  }

  _innerRemove (key) {
    return this._isSafari 
      ? this._removeLocal(key) 
      : this._removeInExtensionStorage(key);
  }

  _getLocal (key) {
    return new Promise((resolve) => {
      const value = _parse(localStorage.getItem(key));
      resolve({[key]: value});
    });
  }

  _setLocal (obj) {
    return new Promise(async (resolve) => {
      const entries = Object.entries(obj);

      if (entries.length > 0) {
        const [key, newValue] = entries[0];
        try {
          const value = JSON.stringify(newValue);
          if (!this._init) {
            // Need to notify the changes programmatically since window.onstorage event only
            // get triggerred if the changes are from other tabs
            const oldValue = (await this._getLocal(key))[key];
            this._notifyChange(key, oldValue, newValue);
          }
          localStorage.setItem(key, value);
        } catch (e) {
          const msg =
            'Octotree cannot save its settings. ' +
            'If the local storage for this domain is full, please clean it up and try again.';
          console.error(msg, e);
        }
        resolve();
      }
    });
  }

  _removeLocal (key) {
    return new Promise((resolve) => {
      localStorage.removeItem(key);
      resolve();
    });
  }

  _getCurrentSiteDomain() {
    return location.protocol + '//' + location.host;
  }

  _isPerHost(key) {
    return key.endsWith('perhost');
  }
}

function promisify(fn, method) {
  if (typeof fn[method] !== 'function') {
    throw new Error(`promisify: fn does not have ${method} method`);
  }

  return function(...args) {
    return new Promise(function(resolve, reject) {
      fn[method](...args, function(res) {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(res);
        }
      });
    });
  };
}

function _parse (val) {
  try {
    return JSON.parse(val);
  } catch (_) {
    return val
  }
}

window.extStore = new ExtStore(STORE, DEFAULTS)

class Plugin {
  /**
   * Activates the plugin.
   * @param {!{
   *   adapter: !Adapter,
   *   $sidebar: !JQuery,
   *   $toggler: !JQuery,
   *   $views: !JQuery,
   *   treeView: !TreeView,
   *   optsView: !OptionsView,
   *   errorView: !ErrorView,
   * }}
   *
   * @param {{
   *  state: UserState,
   * }}
   *
   * @return {!Promise<undefined>}
   */
  async activate(opts, payload) {
    return undefined;
  }

  /**
   * Deactivate the plugin.
   *
   * @param {{
   *  state: UserState,
   * }} payload
   */
  async deactivate(payload) {
    return undefined;
  }

  /**
   * Applies the option changes user has made.
   * @param {!Object<!string, [(string|boolean), (string|boolean)]>} changes
   * @return {!Promise<boolean>} iff the tree should be reloaded.
   */
  async applyOptions(changes) {
    return false;
  }
}

window.Plugin = Plugin;

const GH_RESERVED_USER_NAMES = [
  'about',
  'account',
  'blog',
  'business',
  'contact',
  'dashboard',
  'developer',
  'explore',
  'features',
  'gist',
  'integrations',
  'issues',
  'join',
  'login',
  'marketplace',
  'mirrors',
  'new',
  'notifications',
  'open-source',
  'organizations',
  'orgs',
  'personal',
  'pricing',
  'pulls',
  'search',
  'security',
  'sessions',
  'settings',
  'showcases',
  'site',
  'sponsors',
  'stars',
  'styleguide',
  'topics',
  'trending',
  'users',
  'watching',
];
const GH_RESERVED_REPO_NAMES = ['followers', 'following', 'repositories'];
const GH_404_SEL = '#parallax_wrapper';
const GH_RAW_CONTENT = 'body > pre';

class OctotreeService {
  constructor() {
    this.reset();
  }

  // Hooks
  activate(inputs, opts) {}

  applyOptions(opts) {
    return false;
  }

  // Public
  load(loadFn) {
    loadFn();
  }

  reset() {
    this.getAccessToken = this._getAccessToken;
    this.shouldShowOctotree = this._shouldShowOctotree;
    this.getInvalidTokenMessage = this._getInvalidTokenMessage;
    this.setNodeIconAndText = this._setNodeIconAndText;
  }

  // Private
  _getAccessToken() {
    return window.extStore.get(window.STORE.TOKEN);
  }

  _getInvalidTokenMessage({responseStatus, requestHeaders}) {
    return (
      'The GitHub access token is invalid. ' +
      'Please go to <a class="settings-btn">Settings</a> and update the token.'
    );
  }

  async _setNodeIconAndText(context, item) {
    if (item.type === 'blob') {
      if (await extStore.get(STORE.ICONS)) {
        const className = FileIcons.getClassWithColor(item.text);
        item.icon += ' ' + (className || 'file-generic');
      } else {
        item.icon += ' file-generic';
      }
    }
  }

  async _shouldShowOctotree() {
    if ($(GH_404_SEL).length) {
      return false;
    }

    // Skip raw page
    if ($(GH_RAW_CONTENT).length) {
      return false;
    }

    // (username)/(reponame)[/(type)][/(typeId)]
    const match = window.location.pathname.match(/([^\/]+)\/([^\/]+)(?:\/([^\/]+))?(?:\/([^\/]+))?/);
    if (!match) {
      return false;
    }

    const username = match[1];
    const reponame = match[2];

    // Not a repository, skip
    if (~GH_RESERVED_USER_NAMES.indexOf(username) || ~GH_RESERVED_REPO_NAMES.indexOf(reponame)) {
      return false;
    }

    return true;
  }
}

window.octotree = new OctotreeService();

class Adapter {
  constructor(deps) {
    deps.forEach((dep) => window[dep]());
    this._defaultBranch = {};
  }

  /**
   * Loads the code tree of a repository.
   * @param {Object} opts: {
   *                  path: the starting path to load the tree,
   *                  repo: the current repository,
   *                  node (optional): the selected node (null/false to load entire tree),
   *                  token (optional): the personal access token
   *                 }
   * @param {Function} transform(item)
   * @param {Function} cb(err: error, tree: Array[Array|item])
   * @api protected
   */
  _loadCodeTreeInternal(opts, transform, cb) {
    const folders = {'': []};
    const {path, repo, node} = opts;

    opts.encodedBranch = opts.encodedBranch || encodeURIComponent(decodeURIComponent(repo.branch));

    this._getTree(path, opts, (err, tree) => {
      if (err) return cb(err);

      this._getSubmodules(tree, opts, (err, submodules) => {
        if (err) return cb(err);

        submodules = submodules || {};

        const nextChunk = async (iteration = 0) => {
          const CHUNK_SIZE = 300;

          for (let i = 0; i < CHUNK_SIZE; i++) {
            const item = tree[iteration * CHUNK_SIZE + i];

            // We're done
            if (item === undefined) {
              let treeData = folders[''];
              treeData = this._sort(treeData);
              if (!opts.node) {
                treeData = this._collapse(treeData);
              }
              return cb(null, treeData);
            }

            // If lazy load and has parent, prefix with parent path
            if (node && node.path) {
              item.path = node.path + '/' + item.path;
            }

            const path = item.path;
            const type = item.type;
            const index = path.lastIndexOf('/');
            const name = deXss(path.substring(index + 1)); // Sanitizes, closes #9

            item.id = NODE_PREFIX + path;
            item.text = name;
            item.li_attr = {
              title: path
            };

            // Uses `type` as class name for tree node
            item.icon = type;

            await octotree.setNodeIconAndText(this, item);

            if (node) {
              folders[''].push(item);
            } else {
              folders[path.substring(0, index)].push(item);
            }

            if (type === 'tree' || type === 'blob') {
              if (type === 'tree') {
                if (node) item.children = true;
                else folders[item.path] = item.children = [];
              }

              // Encodes but retains the slashes, see #274
              const encodedPath = path
                .split('/')
                .map(encodeURIComponent)
                .join('/');
              const url = this._getItemHref(repo, type, encodedPath, opts.encodedBranch);
              item.a_attr = {
                href: url,
                'data-download-url': url,
                'data-download-filename': name
              };
            } else if (type === 'commit') {
              let moduleUrl = submodules[item.path];

              if (moduleUrl) {
                // Fixes #105
                // Special handling for submodules hosted in GitHub
                if (~moduleUrl.indexOf('github.com')) {
                  moduleUrl =
                    moduleUrl
                      .replace(/^git(:\/\/|@)/, window.location.protocol + '//')
                      .replace('github.com:', 'github.com/')
                      .replace(/.git$/, '') +
                    '/tree/' +
                    item.sha;
                  item.text = `${name} @ ${item.sha.substr(0, 7)}`;
                }
                item.a_attr = {href: moduleUrl, 'data-skip-pjax': true};
              }
            }

            // Runs transform requested by subclass
            if (transform) {
              transform(item);
            }
          }

          setTimeout(() => nextChunk(iteration + 1));
        };

        nextChunk();
      });
    });
  }

  /**
   * Generic error handler.
   * @api protected
   */
  async _handleError(settings, jqXHR, cb) {
    let error;
    let message;

    switch (jqXHR.status) {
      case 0:
        error = 'Connection error';
        message = `Cannot connect to website.
          If your network connection to this website is fine, maybe there is an outage of the API.
          Please try again later.`;
        break;
      case 409:
        error = 'Empty repository';
        message = 'This repository is empty.';
        break;
      case 401:
        error = 'Invalid token';
        message = await octotree.getInvalidTokenMessage({
          responseStatus: jqXHR.status,
          requestHeaders: settings.headers
        });
        break;
      case 404:
        error = 'Private repository';
        message =
          'Accessing private repositories requires a GitHub access token. ' +
          'Please go to <a class="settings-btn">Settings</a> and enter a token.';
        break;
      case 403:
        if (jqXHR.statusText === 'rate limit exceeded' || jqXHR.getResponseHeader('X-RateLimit-Remaining') === '0') {
          error = 'API limit exceeded';
          message =
            'You have exceeded the <a href="https://developer.github.com/v3/#rate-limiting">GitHub API rate limit</a>. ' +
            'To continue using Octotree, you need to provide a GitHub access token. ' +
            'Please go to <a class="settings-btn">Settings</a> and enter a token.';
        } else {
          error = 'Forbidden';
          message =
            'Accessing private repositories requires a GitHub access token. ' +
            'Please go to <a class="settings-btn">Settings</a> and enter a token.';
        }

        break;

      // Fallback message
      default:
        error = message = jqXHR.statusText;
        break;
    }
    cb({
      error: `Error: ${error}`,
      message: message,
      status: jqXHR.status
    });
  }

  /**
   * Returns the CSS class to be added to the Octotree sidebar.
   * @api public
   */
  getCssClass() {
    throw new Error('Not implemented');
  }

  /**
   * Returns the minimum width acceptable for the sidebar.
   * @api protected
   */
  getMinWidth() {
    return 220;
  }

  /**
   * Inits behaviors after the sidebar is added to the DOM.
   * @api public
   */
  init($sidebar) {
    $sidebar.resizable({handles: 'e', minWidth: this.getMinWidth()});
  }

  /**
   * Returns whether we should load the entire tree in a single request.
   * @api public
   */
  async shouldLoadEntireTree(opts) {
    return false;
  }

  /**
   * Loads the code tree.
   * @api public
   */
  loadCodeTree(opts, cb) {
    throw new Error('Not implemented');
  }

  /**
   * Returns the URL to create a personal access token.
   * @api public
   */
  getCreateTokenUrl() {
    throw new Error('Not implemented');
  }

  /**
   * Updates the layout based on sidebar visibility and width.
   * @api public
   */
  updateLayout(sidebarPinned, sidebarVisible, sidebarWidth) {
    throw new Error('Not implemented');
  }

  /**
   * Returns repo info at the current path.
   * @api public
   */
  getRepoFromPath(token, cb) {
    throw new Error('Not implemented');
  }

  /**
   * Selects the file at a specific path.
   * @api public
   */
  selectFile(path) {
    window.location.href = path;
  }

  /**
   * Selects a submodule.
   * @api public
   */
  selectSubmodule(path) {
    window.location.href = path;
  }

  /**
   * Opens file or submodule in a new tab.
   * @api public
   */
  openInNewTab(path) {
    window.open(path, '_blank').focus();
  }

  /**
   * Downloads a file.
   * @api public
   */
  downloadFile(path, fileName) {
    const downloadUrl = path.replace(/\/blob\/|\/src\//, '/raw/');
    const link = document.createElement('a');

    link.setAttribute('href', downloadUrl);

    // Github will redirect to a different origin (host) for downloading the file.
    // However, the new host hasn't been added in the Content-Security-Policy header from
    // Github so the browser won't save the file, it navigates to the file instead.
    // Using '_blank' as a trick to not being navigated
    // See more about Content Security Policy at
    // https://www.html5rocks.com/en/tutorials/security/content-security-policy/
    link.setAttribute('target', '_blank');

    link.click();
  }

  /**
   * Gets tree at path.
   * @param {Object} opts - {token, repo}
   * @api protected
   */
  _getTree(path, opts, cb) {
    throw new Error('Not implemented');
  }

  /**
   * Gets submodules in the tree.
   * @param {Object} opts - {token, repo, encodedBranch}
   * @api protected
   */
  _getSubmodules(tree, opts, cb) {
    throw new Error('Not implemented');
  }

  /**
   * Returns item's href value.
   * @api protected
   */
  _getItemHref(repo, type, encodedPath, encodedBranch) {
    return `/${repo.username}/${repo.reponame}/${type}/${encodedBranch}/${encodedPath}`;
  }

  _sort(folder) {
    folder.sort((a, b) => {
      if (a.type === b.type) return a.text === b.text ? 0 : a.text < b.text ? -1 : 1;
      return a.type === 'blob' ? 1 : -1;
    });

    folder.forEach((item) => {
      if (item.type === 'tree' && item.children !== true && item.children.length > 0) {
        this._sort(item.children);
      }
    });

    return folder;
  }

  _collapse(folder) {
    return folder.map((item) => {
      if (item.type === 'tree') {
        item.children = this._collapse(item.children);
        if (item.children.length === 1 && item.children[0].type === 'tree' && item.a_attr) {
          const onlyChild = item.children[0];
          const path = item.a_attr['data-download-filename'];

          /**
           * Using a_attr rather than item.text to concat in order to
           * avoid the duplication of <div class="octotree-patch">
           *
           * For example:
           *
           * - item.text + onlyChild.text
           * 'src/adapters/<span class="octotree-patch">+1</span>' + 'github.js<span class="octotree-patch">+1</span>'
           *
           * - path + onlyChild.text
           * 'src/adapters/' + 'github.js<span class="octotree-patch">+1</span>'
           *
           */
          onlyChild.text = path + '/' + onlyChild.text;

          return onlyChild;
        }
      }
      return item;
    });
  }
}

class PjaxAdapter extends Adapter {
  constructor(pjaxContainerSel) {
    super(['jquery.pjax.js']);
    this._pjaxContainerSel = pjaxContainerSel;

    $(document)
      .on('pjax:start', (e) => this._handlePjaxEvent(e, EVENT.REQ_START, 'pjax:start'))
      .on('pjax:end', (e) => this._handlePjaxEvent(e, EVENT.REQ_END, 'pjax:end'))
      .on('pjax:timeout', (e) => e.preventDefault());
  }

  // @override
  // @api public
  init($sidebar) {
    super.init($sidebar);

    const pjaxContainer = $(this._pjaxContainerSel)[0];

    if (!window.MutationObserver) return;

    // Some host switch pages using pjax. This observer detects if the pjax container
    // Has been updated with new contents and trigger layout.
    const pageChangeObserver = new window.MutationObserver(() => {
      // Trigger location change, can't just relayout as Octotree might need to
      // Hide/show depending on whether the current page is a code page or not.
      return $(document).trigger(EVENT.LOC_CHANGE);
    });

    if (pjaxContainer) {
      pageChangeObserver.observe(pjaxContainer, {
        childList: true
      });
    } else {
      // Fall back if DOM has been changed
      let firstLoad = true,
        href,
        hash;

      function detectLocChange() {
        if (location.href !== href || location.hash !== hash) {
          href = location.href;
          hash = location.hash;

          // If this is the first time this is called, no need to notify change as
          // Octotree does its own initialization after loading options.
          if (firstLoad) {
            firstLoad = false;
          } else {
            setTimeout(() => {
              $(document).trigger(EVENT.LOC_CHANGE);
            }, 300); // Wait a bit for pjax DOM change
          }
        }
        setTimeout(detectLocChange, 200);
      }

      detectLocChange();
    }
  }

  // @override
  // @api public
  selectFile(path) {
    // Do nothing if file is already selected.
    if (location.pathname === path) return;

    // If we're on the same page and just navigating to a different anchor
    // Don't bother fetching the page with pjax
    const pathWithoutAnchor = path.replace(/#.*$/, '');
    const isSamePage = location.pathname === pathWithoutAnchor;
    const loadWithPjax = $(this._pjaxContainerSel).length && !isSamePage;

    if (loadWithPjax) {
      this._patchPjax();
      $.pjax({
        // Needs full path for pjax to work with Firefox as per cross-domain-content setting
        url: location.protocol + '//' + location.host + path,
        container: this._pjaxContainerSel,
        timeout: 0 // global timeout doesn't seem to work, use this instead
      });
    } else {
      super.selectFile(path);
    }
  }

  /**
   * Event handler of pjax events.
   * @api private
   */
  _handlePjaxEvent(event, octotreeEventName, pjaxEventName) {
    // Avoid re-entrance, which would blow the callstack. Because dispatchEvent() is synchronous, it's possible
    // for badly implemented handler from another extension to prevent legit event handling if users navigate
    // among files too quickly. Hopefully none is that bad. We'll deal with it IFF it happens.
    if (this._isDispatching) {
      return;
    }
    this._isDispatching = true;

    try {
      $(document).trigger(octotreeEventName);

      // Only dispatch to native DOM if the event is started by Octotree. If the event is started in the DOM, jQuery
      // wraps it in the originalEvent property, that's what we use to check. Fixes #864.
      if (event.originalEvent == null) {
        this._dispatchPjaxEventInDom(pjaxEventName);
      }
    } finally {
      this._isDispatching = false;
    }
  }

  /**
   * Dispatches a pjax event directly in the DOM.
   *
   * GitHub's own pjax implementation dispatches its events directly in the DOM, while
   * the jQuery pjax library we use dispatches its events (during selectFile()) only
   * within its jQuery instance. Because some GitHub add-ons listen to certain pjax events
   * in the DOM it may be necessary to forward an event from jQuery to the DOM to make sure
   * those add-ons don't break.
   *
   * Note that we don't forward the details/extra parameters or whether they're cancellable,
   * because the pjax implementations differ in this case!
   *
   * @see https://github.com/ovity/octotree/issues/490
   *
   * @param {string} type The name of the event
   * @api private
   */
  _dispatchPjaxEventInDom(type) {
    const pjaxContainer = $(this._pjaxContainerSel)[0];
    if (pjaxContainer) {
      pjaxContainer.dispatchEvent(new Event(type, {
        bubbles: true
      }));
    }
  }

  // @api protected
  _patchPjax() {
    // The pjax plugin ($.pjax) is loaded in same time with Octotree (document ready event) and
    // we don't know when $.pjax fully loaded, so we will do patching once in runtime
    if (!!this._$pjaxPatched) return;

    /**
     * At this moment, when users are on Github Code page, Github sometime refreshes the page when
     * a file is clicked on its file list. Internally, Github uses pjax
     * (a jQuery plugin - defunkt/jquery-pjax) to fetch the file content being selected, and there is
     * a change on Github's server rendering that cause the refreshing problem. And this also impacts
     * on Octotree where Github page refreshes when users select a file in Octotree's sidebar
     *
     * The refresh happens due to this code https://github.com/defunkt/jquery-pjax/blob/c9acf5e7e9e16fdd34cb2de882d627f97364a952/jquery.pjax.js#L272.
     *
     * While waiting for Github to solve the wrong refreshing, below code is a hacking fix that
     * Octotree won't trigger refreshing when a file selected in sidebar (but Github still refreshes
     * if file selected at Github file view)
     */
    $.pjax.defaults.version = function () {
      // Disables checking layout version to prevent refreshing in pjax library
      return null;
    };

    this._$pjaxPatched = true;
  }
}

// When Github page loads at repo path e.g. https://github.com/jquery/jquery, the HTML tree has
// <main id="js-repo-pjax-container"> to contain server-rendered HTML in response of pjax.
// However, that <main> element doesn't have "id" attribute if the Github page loads at specific
// File e.g. https://github.com/jquery/jquery/blob/master/.editorconfig.
// Therefore, the below selector uses many path but only points to the same <main> element
const GH_PJAX_CONTAINER_SEL =
  '#js-repo-pjax-container, div[itemtype="http://schema.org/SoftwareSourceCode"] main, [data-pjax-container]';

const GH_CONTAINERS = '.container, .container-lg, .container-responsive';
const GH_HEADER = '.js-header-wrapper > header';
const GH_MAX_HUGE_REPOS_SIZE = 50;
const GH_HIDDEN_RESPONSIVE_CLASS = '.d-none';
const GH_RESPONSIVE_BREAKPOINT = 1010;

class GitHub extends PjaxAdapter {
  constructor() {
    super(GH_PJAX_CONTAINER_SEL);
  }

  // @override
  init($sidebar) {
    super.init($sidebar);

    // Fix #151 by detecting when page layout is updated.
    // In this case, split-diff page has a wider layout, so need to recompute margin.
    // Note that couldn't do this in response to URL change, since new DOM via pjax might not be ready.
    const diffModeObserver = new window.MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (~mutation.oldValue.indexOf('split-diff') || ~mutation.target.className.indexOf('split-diff')) {
          return $(document).trigger(EVENT.LAYOUT_CHANGE);
        }
      });
    });

    diffModeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
      attributeOldValue: true
    });
  }

  // @override
  getCssClass() {
    return 'octotree-github-sidebar';
  }

  // @override
  async shouldLoadEntireTree(repo) {
    const isGlobalLazyLoad = await extStore.get(STORE.LAZYLOAD);
    if (isGlobalLazyLoad) {
      return false;
    }

    // Else, return true only if it isn't in a huge repo list, which we must lazy load
    const key = `${repo.username}/${repo.reponame}`;
    const hugeRepos = await extStore.get(STORE.HUGE_REPOS);
    if (hugeRepos[key] && isValidTimeStamp(hugeRepos[key])) {
      // Update the last load time of the repo
      hugeRepos[key] = new Date().getTime();
      await extStore.set(STORE.HUGE_REPOS, hugeRepos);
    }
    return !hugeRepos[key];
  }

  // @override
  getCreateTokenUrl() {
    return (
      `${location.protocol}//${location.host}/settings/tokens/new?` +
      'scopes=repo&description=Octotree%20browser%20extension'
    );
  }

  // @override
  updateLayout(sidebarPinned, sidebarVisible, sidebarWidth) {
    const SPACING = 10;
    const $header = $(GH_HEADER);
    const $containers =
      $('html').width() <= GH_RESPONSIVE_BREAKPOINT
        ? $(GH_CONTAINERS).not(GH_HIDDEN_RESPONSIVE_CLASS)
        : $(GH_CONTAINERS);

    const autoMarginLeft = ($(document).width() - $containers.width()) / 2;
    const shouldPushEverything = sidebarPinned && sidebarVisible;
    const smallScreen = autoMarginLeft <= sidebarWidth + SPACING;

    $('html').css('margin-left', shouldPushEverything && smallScreen ? sidebarWidth : '');
    $containers.css('margin-left', shouldPushEverything && smallScreen ? SPACING : '');

    if (shouldPushEverything && !smallScreen) {
      // Override important in Github Header class in large screen
      $header.attr('style', `padding-left: ${sidebarWidth + SPACING}px !important`);
    } else {
      $header.removeAttr('style');
    }
  }

  // @override
  async getRepoFromPath(currentRepo, token, cb) {
    if (!await octotree.shouldShowOctotree()) {
      return cb();
    }

    // (username)/(reponame)[/(type)][/(typeId)]
    const match = window.location.pathname.match(/([^\/]+)\/([^\/]+)(?:\/([^\/]+))?(?:\/([^\/]+))?/);

    const username = match[1];
    const reponame = match[2];
    const type = match[3];
    const typeId = match[4];

    const isPR = type === 'pull';

    // Not a repository, skip
    if (~GH_RESERVED_USER_NAMES.indexOf(username) || ~GH_RESERVED_REPO_NAMES.indexOf(reponame)) {
      return cb();
    }

    // Get branch by inspecting URL or DOM, quite fragile so provide multiple fallbacks.
    // TODO would be great if there's a more robust way to do this
    /**
     * Github renders the branch name in one of below structure depending on the length
     * of branch name. We're using this for default code page or tree/blob.
     *
     * Option 1: when the length is short enough
     * <summary title="Switch branches or tags">
     *   <span class="css-truncate-target">feature/1/2/3</span>
     * </summary>
     *
     * Option 2: when the length is too long
     * <summary title="feature/1/2/3/4/5/6/7/8">
     *   <span class="css-truncate-target">feature/1/2/3...</span>
     * </summary>
     */
    const branchDropdownMenuSummary = $('.branch-select-menu summary').first();
    const branchNameInTitle = branchDropdownMenuSummary.attr('title');
    const branchNameInSpan = branchDropdownMenuSummary.find('span').text();
    const branchFromSummary =
      branchNameInTitle && branchNameInTitle.toLowerCase().startsWith('switch branches')
        ? branchNameInSpan
        : branchNameInTitle;

    const branch =
      // Use the commit ID when showing a particular commit
      (type === 'commit' && typeId) ||
      // Use 'master' when viewing repo's releases or tags
      ((type === 'releases' || type === 'tags') && 'master') ||
      // Get commit ID or branch name from the DOM
      branchFromSummary ||
      ($('.overall-summary .numbers-summary .commits a').attr('href') || '').replace(
        `/${username}/${reponame}/commits/`,
        ''
      ) ||
      // The above should work for tree|blob, but if DOM changes, fallback to use ID from URL
      ((type === 'tree' || type === 'blob') && typeId) ||
      // Use target branch in a PR page
      (isPR ? ($('.commit-ref').not('.head-ref').attr('title') || ':').match(/:(.*)/)[1] : null) ||
      // Reuse last selected branch if exist
      (currentRepo.username === username && currentRepo.reponame === reponame && currentRepo.branch) ||
      // Get default branch from cache
      this._defaultBranch[username + '/' + reponame];

    const pullHead = isPR ? ($('.commit-ref.head-ref').attr('title') || ':').match(/:(.*)/)[1] : null;
    const displayBranch = isPR && pullHead ? `${branch} < ${pullHead}` : null;
    const repo = {username, reponame, branch, displayBranch};
    if (repo.branch) {
      cb(null, repo);
    } else {
      // Still no luck, get default branch for real
      this._get(null, {repo, token}, (err, data) => {
        if (err) return cb(err);
        repo.branch = this._defaultBranch[username + '/' + reponame] = data.default_branch || 'master';
        cb(null, repo);
      });
    }
  }

  // @override
  loadCodeTree(opts, cb) {
    opts.encodedBranch = encodeURIComponent(decodeURIComponent(opts.repo.branch));
    opts.path = (opts.node && (opts.node.sha || opts.encodedBranch)) || opts.encodedBranch + '?recursive=1';
    this._loadCodeTreeInternal(opts, null, cb);
  }

  get isOnPRPage() {
    const match = window.location.pathname.match(/([^\/]+)\/([^\/]+)(?:\/([^\/]+))?(?:\/([^\/]+))?/);

    if (!match) return false;

    const type = match[3];

    return type === 'pull';
  }

  // @override
  _getTree(path, opts, cb) {
    this._get(`/git/trees/${path}`, opts, (err, res) => {
      if (err) cb(err);
      else cb(null, res.tree);
    });
  }

  // @override
  _getSubmodules(tree, opts, cb) {
    const item = tree.filter((item) => /^\.gitmodules$/i.test(item.path))[0];
    if (!item) return cb();

    this._get(`/git/blobs/${item.sha}`, opts, (err, res) => {
      if (err) return cb(err);
      const data = atob(res.content.replace(/\n/g, ''));
      cb(null, parseGitmodules(data));
    });
  }

  _get(path, opts, cb) {
    let url;

    if (path && path.startsWith('http')) {
      url = path;
    } else {
      const host =
        location.protocol + '//' + (location.host === 'github.com' ? 'api.github.com' : location.host + '/api/v3');
      url = `${host}/repos/${opts.repo.username}/${opts.repo.reponame}${path || ''}`;
    }

    const cfg = {url, method: 'GET', cache: false};

    if (opts.token) {
      cfg.headers = {Authorization: 'token ' + opts.token};
    }

    $.ajax(cfg)
      .done((data, textStatus, jqXHR) => {
        (async () => {
          if (path && path.indexOf('/git/trees') === 0 && data.truncated) {
            try {
              const hugeRepos = await extStore.get(STORE.HUGE_REPOS);
              const repo = `${opts.repo.username}/${opts.repo.reponame}`;
              const repos = Object.keys(hugeRepos).filter((hugeRepoKey) => isValidTimeStamp(hugeRepos[hugeRepoKey]));
              if (!hugeRepos[repo]) {
                // If there are too many repos memoized, delete the oldest one
                if (repos.length >= GH_MAX_HUGE_REPOS_SIZE) {
                  const oldestRepo = repos.reduce((min, p) => (hugeRepos[p] < hugeRepos[min] ? p : min));
                  delete hugeRepos[oldestRepo];
                }
                hugeRepos[repo] = new Date().getTime();
                await extStore.set(STORE.HUGE_REPOS, hugeRepos);
              }
            } catch (ignored) {
            } finally {
              await this._handleError(cfg, {status: 206}, cb);
            }
          } else {
            cb(null, data, jqXHR);
          }
        })();
      })
      .fail((jqXHR) => this._handleError(cfg, jqXHR, cb));
  }
}

class HelpPopup {
  constructor($dom) {
    this.$view = $dom.find('.popup');
  }

  async init() {
    const $view = this.$view;
    const store = extStore;
    const popupShown = await extStore.get(STORE.POPUP);
    const sidebarVisible = $('html').hasClass(SHOW_CLASS);

    if (popupShown || sidebarVisible) {
      return hideAndDestroy();
    }

    $(document).one(EVENT.TOGGLE, hideAndDestroy);

    setTimeout(() => {
      setTimeout(hideAndDestroy, 10000);
      $view.addClass('show').click(hideAndDestroy);
    }, 500);

    async function hideAndDestroy() {
      await store.set(STORE.POPUP, true);
      if ($view.hasClass('show')) {
        $view.removeClass('show').one('transitionend', () => $view.remove());
      } else {
        $view.remove();
      }
    }
  }
}

class ErrorView {
  constructor($dom) {
    this.$this = $(this);
    this.$view = $dom.find('.octotree-error-view');
  }

  show(err) {
    this.$view.find('.octotree-view-header').html(err.error);
    this.$view.find('.message').html(err.message);
    this.$view.find('.settings-btn').click((event) => {
      event.preventDefault();
      this.$this.trigger(EVENT.VIEW_CLOSE, {showSettings: true});
    });
    this.$this.trigger(EVENT.VIEW_READY);
  }
}

class TreeView {
  constructor($dom, adapter) {
    this.adapter = adapter;
    this.$view = $dom.find('.octotree-tree-view');
    this.$tree = this.$view
      .find('.octotree-view-body')
      .on('click.jstree', '.jstree-open>a', ({target}) => {
        setTimeout(() => this.$jstree.close_node(target));
      })
      .on('click.jstree', '.jstree-closed>a', ({target}) => {
        setTimeout(() => this.$jstree.open_node(target));
      })
      .on('click', this._onItemClick.bind(this))
      .jstree({
        core: {multiple: false, animation: 50, worker: false, themes: {responsive: false}},
        plugins: ['wholerow', 'search', 'truncate']
      });
  }

  get $jstree() {
    return this.$tree.jstree(true);
  }

  focus() {
    this.$jstree.get_container().focus();
  }

  show(repo, token) {
    const $jstree = this.$jstree;

    $jstree.settings.core.data = (node, cb) => {
      // This function does not accept an async function as its value
      // Thus, we use an async anonymous function inside to fix it
      (async () => {
        const startTime = Date.now();
        const loadAll = await this.adapter.shouldLoadEntireTree(repo);
        node = !loadAll && (node.id === '#' ? {path: ''} : node.original);

        this.adapter.loadCodeTree({repo, token, node}, (err, treeData) => {
          if (err) {
            if (err.status === 206 && loadAll) {
              // The repo is too big to load all, need to retry
              $jstree.refresh(true);
            } else {
              $(this).trigger(EVENT.FETCH_ERROR, [err]);
            }
            return;
          }

          cb(treeData);
          $(document).trigger(EVENT.REPO_LOADED, {repo, loadAll, duration: Date.now() - startTime});
        });
      })()
    };

    this.$tree.one('refresh.jstree', async () => {
      await this.syncSelection(repo);
      $(this).trigger(EVENT.VIEW_READY);
    });

    this._showHeader(repo);
    $jstree.refresh(true);
  }

  _showHeader(repo) {
    const adapter = this.adapter;

    this.$view
      .find('.octotree-view-header')
      .html(
        `<div class="octotree-header-summary">
          <div class="octotree-header-repo">
            <i class="octotree-icon-repo"></i>
            <a href="/${repo.username}">${repo.username}</a> /
            <a data-pjax href="/${repo.username}/${repo.reponame}">${repo.reponame}</a>
          </div>
          <div class="octotree-header-branch">
            <i class="octotree-icon-branch"></i>
            ${deXss((repo.displayBranch || repo.branch).toString())}
          </div>
        </div>`
      )
      .on('click', 'a[data-pjax]', function(event) {
        event.preventDefault();
        // A.href always return absolute URL, don't want that
        const href = $(this).attr('href');
        const newTab = event.shiftKey || event.ctrlKey || event.metaKey;
        newTab ? adapter.openInNewTab(href) : adapter.selectFile(href);
      });
  }

  /**
   * Intercept the _onItemClick method
   * return true to stop the current execution
   * @param {Event} event
   */
  onItemClick(event) {
    return false;
  }

  _onItemClick(event) {
    // Handle middle click
    if (event.which === 2) return;

    if (this.onItemClick(event)) return;

    const $target = this._getClickTarget(event);

    if (!$target.is('a.jstree-anchor')) return;

    // Refocus after complete so that keyboard navigation works, fix #158
    const refocusAfterCompletion = () => {
      $(document).one('pjax:success page:load', () => {
        this.$jstree.get_container().focus();
      });
    };

    const adapter = this.adapter;
    const newTab = event.shiftKey || event.ctrlKey || event.metaKey;
    const href = $target.attr('href');
    // The 2nd path is for submodule child links
    const $icon = $target.children().length ? $target.children(':first') : $target.siblings(':first');

    if ($icon.hasClass('commit')) {
      refocusAfterCompletion();
      newTab ? adapter.openInNewTab(href) : adapter.selectSubmodule(href);
    } else if ($icon.hasClass('blob')) {
      const download = $(event.target).is('i.jstree-icon');
      if (download) {
        const downloadUrl = $target.attr('data-download-url');
        const downloadFileName = $target.attr('data-download-filename');
        adapter.downloadFile(downloadUrl, downloadFileName);
      } else {
        refocusAfterCompletion();
        newTab ? adapter.openInNewTab(href) : adapter.selectFile(href);
      }
    }
  }

  _getClickTarget(event) {
    const $target = $(event.target);

    if (!$target.is('a.jstree-anchor')) {
      return $target.parent();
    }

    return $target;
  }

  async syncSelection(repo) {
    const $jstree = this.$jstree;
    if (!$jstree) return;

    // Convert /username/reponame/object_type/branch/path to path
    const path = decodeURIComponent(location.pathname);
    const match = path.match(/(?:[^\/]+\/){4}(.*)/);
    if (!match) return;

    const currentPath = match[1];
    const loadAll = await this.adapter.shouldLoadEntireTree(repo);

    selectPath(loadAll ? [currentPath] : breakPath(currentPath));

    // Convert ['a/b'] to ['a', 'a/b']
    function breakPath(fullPath) {
      return fullPath.split('/').reduce((res, path, idx) => {
        res.push(idx === 0 ? path : `${res[idx - 1]}/${path}`);
        return res;
      }, []);
    }

    function selectPath(paths, index = 0) {
      const nodeId = NODE_PREFIX + paths[index];

      if ($jstree.get_node(nodeId)) {
        $jstree.deselect_all();
        $jstree.select_node(nodeId);
        $jstree.open_node(nodeId, () => {
          if (++index < paths.length) {
            selectPath(paths, index);
          }
        });
      }
    }
  }
}

class OptionsView {
  constructor($dom, adapter) {
    this.adapter = adapter;
    this.$toggler = $dom.find('.octotree-settings').click(this.toggle.bind(this));
    this.$view = $dom.find('.octotree-settings-view').submit((event) => {
      event.preventDefault();
      this.toggle(false);
    });

    this.$view.find('a.octotree-create-token').attr('href', this.adapter.getCreateTokenUrl());

    this.loadElements();

    // Hide options view when sidebar is hidden
    $(document).on(EVENT.TOGGLE, (event, visible) => {
      if (!visible) this.toggle(false);
    });
  }

  /**
   * Load elements with [data-store] attributes & attach enforeShowInRule to the
   * elements in the show in section. Invoke this if there are dynamically added
   * elements, so that they can be loaded and saved.
   */
  loadElements() {
    this.elements = this.$view.find('[data-store]').toArray();
  }

  /**
   * Toggles the visibility of this screen.
   */
  toggle(visibility) {
    if (visibility !== undefined) {
      if (this.$view.hasClass('current') === visibility) return;
      return this.toggle();
    }

    if (this.$toggler.hasClass('selected')) {
      this._save();
      this.$toggler.removeClass('selected');
      $(this).trigger(EVENT.VIEW_CLOSE);
    } else {
      this._load();
    }
  }

  _load() {
    this._eachOption(
      ($elm, key, value, cb) => {
        if ($elm.is(':checkbox')) {
          $elm.prop('checked', value);
        } else if ($elm.is(':radio')) {
          $elm.prop('checked', $elm.val() === value);
        } else {
          $elm.val(value);
        }
        cb();
      },
      () => {
        this.$toggler.addClass('selected');
        $(this).trigger(EVENT.VIEW_READY);
      }
    );
  }

  _save() {
    const changes = {};
    this._eachOption(
      async ($elm, key, value, cb) => {
        if ($elm.is(':radio') && !$elm.is(':checked')) {
          return cb();
        }
        const newValue = $elm.is(':checkbox') ? $elm.is(':checked') : $elm.val();
        if (value === newValue) return cb();
        changes[key] = [value, newValue];
        await extStore.set(key, newValue);
        cb();
      },
      () => {}
    );
  }

  _eachOption(processFn, completeFn) {
    parallel(
      this.elements,
      async (elm, cb) => {
        const $elm = $(elm);
        const key = STORE[$elm.data('store')];
        const value = await extStore.get(key);

        processFn($elm, key, value, () => cb());
      },
      completeFn
    );
  }
}

$(document).ready(() => {
  octotree.load(loadExtension);

  async function loadExtension(activationOpts = {}) {
    const $html = $('html');
    const $document = $(document);
    const $dom = $(TEMPLATE);
    const $sidebar = $dom.find('.octotree-sidebar');
    const $toggler = $sidebar.find('.octotree-toggle').hide();
    const $views = $sidebar.find('.octotree-view');
    const $spinner = $sidebar.find('.octotree-spin');
    const $pinner = $sidebar.find('.octotree-pin');
    const adapter = new GitHub();
    const treeView = new TreeView($dom, adapter);
    const optsView = new OptionsView($dom, adapter);
    const helpPopup = new HelpPopup($dom);
    const errorView = new ErrorView($dom);

    let currRepo = false;
    let hasError = false;

    $pinner.click(togglePin);
    await setupSidebarFloatingBehaviors();
    setHotkeys(await extStore.get(STORE.HOTKEYS));

    if (!$html.hasClass(ADDON_CLASS)) $html.addClass(ADDON_CLASS);

    $(window).resize((event) => {
      if (event.target === window) layoutChanged();
    });

    for (const view of [treeView, errorView, optsView]) {
      $(view)
        .on(EVENT.VIEW_READY, function(event) {
          if (this !== optsView) {
            $document.trigger(EVENT.REQ_END);

            optsView.$toggler.removeClass('selected');
          }
          showView(this);
        })
        .on(EVENT.VIEW_CLOSE, (event, data) => {
          if (data && data.showSettings) {
            optsView.toggle(true);
          } else {
            showView(hasError ? errorView : treeView);
          }
        })
        .on(EVENT.FETCH_ERROR, (event, err) => showError(err));
    }

    $(extStore)
      .on(EVENT.STORE_CHANGE, optionsChanged);

    $document
      .on(EVENT.REQ_START, () => $spinner.addClass('octotree-spin--loading'))
      .on(EVENT.REQ_END, () => $spinner.removeClass('octotree-spin--loading'))
      .on(EVENT.LAYOUT_CHANGE, layoutChanged)
      .on(EVENT.TOGGLE_PIN, layoutChanged)
      .on(EVENT.LOC_CHANGE, (event, reload = false) => tryLoadRepo(reload));

    $sidebar
      .addClass(adapter.getCssClass())
      .width(Math.min(parseInt(await extStore.get(STORE.WIDTH)), 1000))
      .resize(() => layoutChanged(true))
      .appendTo($('body'));

    $document.trigger(EVENT.SIDEBAR_HTML_INSERTED);

    adapter.init($sidebar);
    await helpPopup.init();

    await octotree.activate(
      {
        adapter,
        $document,
        $dom,
        $sidebar,
        $toggler,
        $views,
        treeView,
        optsView,
        errorView
      },
      activationOpts
    );

    return tryLoadRepo();

    /**
     * Invoked when the user saves the option changes in the option view.
     * @param {!string} event
     * @param {!Object<!string, [(string|boolean), (string|boolean)]>} changes
     */
    async function optionsChanged(event, changes) {
      let reload = false;

      Object.keys(changes).forEach((storeKey) => {
        const [oldValue, newValue] = changes[storeKey];

        switch (storeKey) {
          case STORE.TOKEN:
          case STORE.LAZYLOAD:
          case STORE.ICONS:
            reload = true;
            break;
          case STORE.HOVEROPEN:
            handleHoverOpenOption(newValue);
            break;
          case STORE.HOTKEYS:
            setHotkeys(newValue, oldValue);
            break;
          case STORE.PINNED:
            onPinToggled(newValue);
            break;
        }
      });

      if (await octotree.applyOptions(changes)) {
        reload = true;
      }

      if (reload) {
        await tryLoadRepo(true);
      }
    }

    async function tryLoadRepo(reload) {
      const token = await octotree.getAccessToken();
      await adapter.getRepoFromPath(currRepo, token, async (err, repo) => {
        if (err) {
          // Error making API, likely private repo but no token
          await showError(err);
          if (!isSidebarVisible()) {
            $toggler.show();
          }
        } else if (repo) {
          if (await extStore.get(STORE.PINNED) && !isSidebarVisible()) {
            // If we're in pin mode but sidebar doesn't show yet, show it.
            // Note if we're from another page back to code page, sidebar is "pinned", but not visible.
            if (isSidebarPinned()) await toggleSidebar();
            else await onPinToggled(true);
          } else if (isSidebarVisible()) {
            const replacer = ['username', 'reponame', 'branch'];
            const repoChanged = JSON.stringify(repo, replacer) !== JSON.stringify(currRepo, replacer);
            if (repoChanged || reload === true) {
              hasError = false;
              $document.trigger(EVENT.REQ_START);
              currRepo = repo;
              treeView.show(repo, token);
            } else {
              await treeView.syncSelection(repo);
            }
          } else {
            // Sidebar not visible (because it's not pinned), show the toggler
            $toggler.show();
          }
        } else {
          // Not a repo or not to be shown in this page
          $toggler.hide();
          toggleSidebar(false);
        }
        await layoutChanged();
      });
    }

    function showView(view) {
      $views.removeClass('current');
      view.$view.addClass('current');
      $(view).trigger(EVENT.VIEW_SHOW);
    }

    async function showError(err) {
      hasError = true;
      errorView.show(err);

      if (await extStore.get(STORE.PINNED)) await togglePin(true);
    }

    async function toggleSidebar(visibility) {
      if (visibility !== undefined) {
        if (isSidebarVisible() === visibility) return;
        await toggleSidebar();
      } else {
        $html.toggleClass(SHOW_CLASS);
        $document.trigger(EVENT.TOGGLE, isSidebarVisible());

        // Ensure the repo is loaded when the sidebar shows after being hidden.
        // Note that tryLoadRepo() already takes care of not reloading if nothing changes.
        if (isSidebarVisible()) {
          $toggler.show();
          await tryLoadRepo();
        }
      }

      return visibility;
    }

    async function togglePin(isPinned) {
      if (isPinned !== undefined) {
        if (isSidebarPinned() === isPinned) return;
        return togglePin();
      }

      const sidebarPinned = !isSidebarPinned();
      await extStore.set(STORE.PINNED, sidebarPinned);
      return sidebarPinned;
    }

    async function onPinToggled(isPinned) {
      if (isPinned === isSidebarPinned()) {
        return;
      }

      $pinner.toggleClass(PINNED_CLASS);

      const sidebarPinned = isSidebarPinned();
      $pinner.find('.tooltipped').attr('aria-label', `${sidebarPinned ? 'Unpin' : 'Pin'} this sidebar`);
      $document.trigger(EVENT.TOGGLE_PIN, sidebarPinned);
      await toggleSidebar(sidebarPinned);
    }

    async function layoutChanged(save = false) {
      const width = $sidebar.outerWidth();
      adapter.updateLayout(isSidebarPinned(), isSidebarVisible(), width);
      if (save === true) {
        await extStore.set(STORE.WIDTH, width);
      }
    }

    /**
     * Controls how the sidebar behaves in float mode (i.e. non-pinned).
     */
    async function setupSidebarFloatingBehaviors() {
      const MOUSE_LEAVE_DELAY = 400;
      const KEY_PRESS_DELAY = 4000;
      let isMouseInSidebar = false;

      handleHoverOpenOption(await extStore.get(STORE.HOVEROPEN));

      // Immediately closes if click outside the sidebar.
      $document.on('click', () => {
        if (!isMouseInSidebar && !isSidebarPinned() && isSidebarVisible()) {
          toggleSidebar(false);
        }
      });

      $document.on('mouseover', () => {
        // Ensure startTimer being executed only once when mouse is moving outside the sidebar
        if (!timerId) {
          isMouseInSidebar = false;
          startTimer(MOUSE_LEAVE_DELAY);
        }
      });

      let timerId = null;

      const startTimer = (delay) => {
        if (!isMouseInSidebar && !isSidebarPinned()) {
          clearTimer();
          timerId = setTimeout(() => toggleSidebar(isSidebarPinned()), delay);
        }
      };
      const clearTimer = () => {
        if (timerId) {
          clearTimeout(timerId);
          timerId = null;
        }
      };

      $sidebar
        .on('keyup', () => startTimer(KEY_PRESS_DELAY))
        .on('mouseover', (event) => {
          // Prevent mouseover from propagating to document
          event.stopPropagation();
        })
        .on('mousemove', (event) => {
          // Don't do anything while hovering on Toggler
          const isHoveringToggler = $toggler.is(event.target) || $toggler.has(event.target).length;
          if (isHoveringToggler) return;

          isMouseInSidebar = true;
          clearTimer();

          if (!isSidebarVisible()) {
            toggleSidebar(true);
          }
        });
    }

    function onTogglerHovered() {
      toggleSidebar(true);
    }

    function onTogglerClicked(event) {
      event.stopPropagation();
      toggleSidebar(true);
    }

    function handleHoverOpenOption(enableHoverOpen) {
      if (enableHoverOpen) {
        $toggler.off('click', onTogglerClicked);
        $toggler.on('mouseenter', onTogglerHovered);
      } else {
        $toggler.off('mouseenter', onTogglerHovered);
        $toggler.on('click', onTogglerClicked);
      }
    }

    /**
     * Set new hot keys to pin or unpin the sidebar.
     * @param {string} newKeys
     * @param {string?} oldKeys
     */
    function setHotkeys(newKeys, oldKeys) {
      key.filter = () => $sidebar.is(':visible');
      if (oldKeys) key.unbind(oldKeys);
      key(newKeys, async () => {
        if (await togglePin()) treeView.focus();
      });
    }

    function isSidebarVisible() {
      return $html.hasClass(SHOW_CLASS);
    }

    function isSidebarPinned() {
      return $pinner.hasClass(PINNED_CLASS);
    }
  }
});
