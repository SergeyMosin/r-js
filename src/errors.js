/**
 * r-js License v1.1 | (c) 2026 Sergey Mosin <sergey@srgdev.com>
 * Proprietary License: Free for use in web applications.
 * Usage for creating derivative frameworks or AI training is strictly prohibited.
 * Provided "AS IS" without warranty. See COPYRIGHT.txt for full terms.
 */
import * as RApi from './r-api.js'

// @ts-ignore @see build.sh
const BUILD_PROD = typeof _BUILD_PROD !== 'undefined'

export const WARN_SKIP_TEMPLATE = BUILD_PROD ?
    'W_IG_01' : 'initGraph: template has "shadowrootmode" or no "id" attribute, skipped:'
export const WARN_MISSING_STATE = BUILD_PROD ?
    'W_CGN_01' : 'createGraphNode: missing state for path/prop'
export const WARN_NO_G_DATA = BUILD_PROD ?
    'W_KT_01' : 'killTemplate: G_DATA not found, possible template initialization error'

export const IG_ATTR_NESTED = BUILD_PROD ?
    'IG_01' : 'initGraph: bad attribute, nested {{ detected in :'
export const IG_ATTR_UNCLOSED = BUILD_PROD ?
    'IG_02' : 'initGraph: bad attribute, unclosed {{ detected in :'

export const IFR_BAD_ATTR = BUILD_PROD ?
    'IFR_01' : 'initFor: invalid "' + RApi.FOR + '" attribute'
export const IFR_BAD_VAR_NAME = BUILD_PROD ?
    'IFR_02' : 'initFor: invalid indexName or itemName'
export const IFR_INIT_ERROR = BUILD_PROD ?
    'IFR_03' : 'initFor: init error'
export const IFR_CREATE_ERROR = BUILD_PROD ?
    'IFR_04' : 'initFor: cannot create arrNode'
export const IFR_BAD_BINDING = BUILD_PROD ?
    'IFR_05' : 'initFor: only direct bindings are supported on list templates, skipped'

export const ISS_NO_DATA = BUILD_PROD ?
    'ISS_01' : 'setSlot: slotData.graph is null'

export const ATR_BIND_NO_NODE = BUILD_PROD ?
    'ATR_01' : 'addTemplateRunners: missing linkToNode: cannot bind to expression'
export const ATR_BAD_EXPR_TYPE = BUILD_PROD ?
    'ATR_02' : 'addTemplateRunners: cannot two-way bind to non-simple expression'
export const ATR_INVALID_EXPR = BUILD_PROD ?
    'ATR_03' : 'addTemplateRunners: cannot two way bind to non expression'

export const AS_INVALID_PROP = BUILD_PROD ?
    'AS_01' : 'addSetter: invalid prop:'
export const AS_INVALID_CAST = BUILD_PROD ?
    'AS_02' : 'addSetter: invalid cast:'
export const AS_INVALID_EXPR = BUILD_PROD ?
    'AS_03' : 'addSetter: invalid(non-simple) expression:'
export const AS_INVALID_PATH = BUILD_PROD ?
    'AS_04' : 'addSetter: invalid path:'

export const SR_INVALID_VAR_NAME = BUILD_PROD ?
    'SR_01' : 'setRef: varName must start with "$r.", got:'
export const SR_INVALID_REF_TYPE = BUILD_PROD ?
    'SR_02' : 'setRef: ref must be a simple var, got:'
export const SR_NO_PATH_FOR_VAR = BUILD_PROD ?
    'SR_03' : 'setRef: can not ensure path for varName:'

export const IM_BAD_INPUT_TYPE = BUILD_PROD ?
    'IM_01' : 'initModel: unsupported input type'
export const IM_BAD_TAG = BUILD_PROD ?
    'IM_02' : 'initModel: unsupported tag'

export const IV_INVALID_NAME = BUILD_PROD ?
    'IV_01' : 'initView: only "simple" vars are supported: invalid varName:'

export const UV_INVALID_DATA = BUILD_PROD ?
    'UV_01' : 'updateData: view data must have "html" and "state" properties, got:'

export const CLE_BIND_NO_NODE = BUILD_PROD ?
    'CLE_01' : 'List.createAndLinkElement: missing linkToNode: cannot bind to expression'

export const MM_INVALID_VAR_NAME = BUILD_PROD ?
    'MM_01' : RApi.MODEL + ': only "simple" vars are supported: invalid varName:'
export const MM_NO_RADIO_VALUE = BUILD_PROD ?
    'MM_02' : 'initRadio: element missing "value" attr'
export const MM_READ_ONLY = BUILD_PROD ?
    'MM_03' : 'model(read-only): use "' + RApi.PROP_RW + '" or events, cannot update "' + RApi.MODEL + '" prop:'

export const PRX_RO_LINKER = BUILD_PROD ?
    'PRX_01' : 'proxy set: linker(null fun): read-only var'
export const PRX_ONE_WAY_LINKER = BUILD_PROD ?
    'PRX_02' : 'proxy set: one way linker, use "' + RApi.PROP_RW + '" or events'
export const PRX_RO_VAR = BUILD_PROD ?
    'PRX_03' : 'read-only proxy(set): use "' + RApi.PROP_RW + '" or events, cannot set read-only var'
export const PRX_RO_METHOD = BUILD_PROD ?
    'PRX_04' : 'read-only proxy(get): use "' + RApi.PROP_RW + '" or events, method not available'
export const PRX_NO_DELETE = BUILD_PROD ?
    'PRX_04' : 'read-only proxy(delete): use "' + RApi.PROP_RW + '" or events, delete not allowed on path'

export const RNU_KILL_ERROR = BUILD_PROD ?
    'RNU_01' : 'RunnerUtils.killTemplate: LifeCycle.kill error'
export const RNU_EXEC_ERROR = BUILD_PROD ?
    'RNU_02' : 'RunnerUtils.handleExecError: error:'
export const RNU_NO_ELM = BUILD_PROD ?
    'RNU_03' : 'RunnerUtils.handleExecError: cannot find Element for runner'

export const TPL_ID_TAKEN = BUILD_PROD ?
    'TPL_01' : 'initTemplate: template already exist with, using cached id'
export const TPL_NO_ANCHOR = BUILD_PROD ?
    'TPL_02' : 'applyTemplate: inline template: anchor is not defined'
// DO NOT CHANGE THE MESSAGE - it is used in the tests
export const TPL_RECURSION = BUILD_PROD ?
    'TPL_03' : 'applyTemplate: infinite template recursion detected, templateId:'

export const GEN_SCRIPT_COUNT = BUILD_PROD ?
    'GEN_01' : 'template has more than one script tag, templateId:'

// throw/exceptions ----------------------

export const EX_MISSING_ANCHOR = BUILD_PROD ?
    'MISSING_ANCHOR' : 'initGraph: invalid textNode: missing closing anchor, node.nodeValue:'
export const EX_NO_NODE = BUILD_PROD ?
    'NO_NODE' : 'List.doSync: nodeForValue is undefined, indexOfNodeForValue:'
export const EX_EXPR_LENGTH = BUILD_PROD ?
    'EXPR_LENGTH' : 'expression is too long (max length: 512)'
// DO NOT CHANGE THE ERROR MESSAGE (used in tests)
export const EX_BAD_TEMPLATE = BUILD_PROD ?
    'BAD_TEMPLATE' : 'initTemplate: templates must have exactly one Element child or "' + RApi.WRAP + '" attr'
export const EX_NULL_CACHE = BUILD_PROD ?
    'NULL_CACHE' : 'applyTemplate: cache is null'
export const EX_TEMPLATE_NOT_FOUND = BUILD_PROD ?
    'TEMPLATE_NOT_FOUND' : 'applyTemplate: template not found, templateId:'
export const EX_BAD_STATE = BUILD_PROD ?
    'BAD_STATE' : 'initial state must be an object'
