(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,248858,e=>{"use strict";var t=e.i(704846);function a(e){let t=e.split("/").pop()||"sample.ts",a=`// ${t}
// Version: 1.0.0

export function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

export function add(a: number, b: number): number {
  return a + b;
}

export const VERSION = '1.0.0';
`,n=`// ${t}
// Version: 1.1.0 - Feature A

export function greet(name: string, greeting: string = 'Hello'): string {
  return \`\${greeting}, \${name}!\`;
}

export function add(a: number, b: number): number {
  return a + b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

export const VERSION = '1.1.0';
`;return{filePath:e,baseContent:a,oursContent:n,theirsContent:`// ${t}
// Version: 1.1.0 - Feature B

export function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

export function add(a: number, b: number, c: number = 0): number {
  return a + b + c;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export const VERSION = '1.1.0';
`,resolvedContent:n,isResolved:!1}}async function n(e,n){let{projectName:o,projectId:i,writeOutput:r}=n;if(!i||!o)return void await r("Error: No active project. Please open a project first.");await r("Creating merge conflict scenario...\n");let s=[];for(let t of e.length>0?e:["/src/utils/helpers.ts","/src/components/Button.tsx","/src/config.ts"]){let e=a(t);s.push(e),await r(`  Created conflict for: ${t}`)}let{openTab:l}=t.tabActions;await l({conflicts:s,oursBranch:"feature-a",theirsBranch:"feature-b",projectId:i,projectName:o},{kind:"merge-conflict"}),await r("\n✓ Merge conflict resolution tab opened."),await r(`  Conflicting files: ${s.length}`),await r("  Branches: feature-a ← feature-b")}async function o(e,n){let{projectName:o,projectId:i,writeOutput:r}=n;if(!i||!o)return void await r("Error: No active project. Please open a project first.");let s=a("/test/conflict.ts"),{openTab:l}=t.tabActions;await l({conflicts:[s],oursBranch:"main",theirsBranch:"feature",projectId:i,projectName:o},{kind:"merge-conflict"}),await r("✓ Merge conflict tab opened with test data.")}async function i(e,n){let{projectName:o,projectId:i,writeOutput:r}=n;if(!i||!o)return void await r("Error: No active project. Please open a project first.");await r("Creating complex merge conflict scenario...\n");let s=[a("/src/services/api.ts"),{filePath:"/src/components/Header.tsx",baseContent:`import React from 'react';

export const Header: React.FC = () => {
  return (
    <header>
      <h1>My App</h1>
    </header>
  );
};
`,oursContent:`import React from 'react';
import { Logo } from './Logo';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <Logo />
      <h1>My App - Feature A</h1>
    </header>
  );
};
`,theirsContent:`import React from 'react';
import { Navigation } from './Navigation';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <h1>My App</h1>
      <Navigation />
    </header>
  );
};
`,resolvedContent:"",isResolved:!1},{filePath:"/config/settings.json",baseContent:`{
  "version": "1.0.0",
  "api": {
    "endpoint": "https://api.example.com"
  }
}
`,oursContent:`{
  "version": "1.1.0",
  "api": {
    "endpoint": "https://api.example.com",
    "timeout": 5000
  },
  "features": {
    "darkMode": true
  }
}
`,theirsContent:`{
  "version": "1.1.0",
  "api": {
    "endpoint": "https://api-v2.example.com"
  },
  "features": {
    "analytics": true
  }
}
`,resolvedContent:"",isResolved:!1}];for(let e of s)e.resolvedContent||(e.resolvedContent=e.oursContent);let{openTab:l}=t.tabActions;for(let e of(await l({conflicts:s,oursBranch:"develop",theirsBranch:"feature/complex-merge",projectId:i,projectName:o},{kind:"merge-conflict"}),await r(`✓ Created ${s.length} conflicting files:`),s))await r(`  - ${e.filePath}`);await r("\nMerge conflict resolution tab opened.")}async function r(e,a){let{writeOutput:n}=a,{openTab:o}=t.tabActions,i=`function hello(name) {
  console.log("Hello, " + name);
}

hello("World");
`,r=`function hello(name: string): void {
  console.log(\`Hello, \${name}!\`);
}

function goodbye(name: string): void {
  console.log(\`Goodbye, \${name}!\`);
}

hello("World");
goodbye("World");
`;await o({files:[{formerFullPath:"/test/sample.js",formerCommitId:"abc1234",latterFullPath:"/test/sample.ts",latterCommitId:"def5678",formerContent:i,latterContent:r}],editable:!1},{kind:"diff"}),await n("✓ Diff tab opened with test data.")}async function s(e,a){let{projectId:n,writeOutput:o}=a;if(!n)return void await o("Error: No active project. Please open a project first.");let{openTab:i}=t.tabActions,r=`// Original content
const message = "Hello";
console.log(message);
`,s=`// Modified content - you can edit this
const message = "Hello, World!";
const greeting = "Welcome!";
console.log(message, greeting);
`;await i({files:[{formerFullPath:"/test/editable.ts",formerCommitId:"HEAD~1",latterFullPath:"/test/editable.ts",latterCommitId:"working",formerContent:r,latterContent:s}],editable:!0},{kind:"diff"}),await o("✓ Editable diff tab opened."),await o("  You can edit the right side of the diff.")}async function l(e,a){let{writeOutput:n}=a,{openTab:o}=t.tabActions,i=[{formerFullPath:"/src/index.ts",formerCommitId:"main",latterFullPath:"/src/index.ts",latterCommitId:"feature",formerContent:'export const VERSION = "1.0.0";',latterContent:'export const VERSION = "2.0.0";\nexport const NAME = "MyApp";'},{formerFullPath:"/src/config.ts",formerCommitId:"main",latterFullPath:"/src/config.ts",latterCommitId:"feature",formerContent:'export const API_URL = "http://localhost:3000";',latterContent:'export const API_URL = "https://api.production.com";'},{formerFullPath:"/package.json",formerCommitId:"main",latterFullPath:"/package.json",latterCommitId:"feature",formerContent:'{\n  "name": "my-app",\n  "version": "1.0.0"\n}',latterContent:'{\n  "name": "my-app",\n  "version": "2.0.0",\n  "description": "My awesome app"\n}'}];await o({files:i,editable:!1},{kind:"diff"}),await n(`✓ Multi-file diff tab opened with ${i.length} files.`)}async function c(e,a){let{writeOutput:n}=a,{openTab:o}=t.tabActions;await o({path:"welcome",name:"Welcome"},{kind:"welcome"}),await n("✓ Welcome tab opened.")}async function m(e,a){let{writeOutput:n}=a,o=e[0]||"general",{openTab:i}=t.tabActions;await i({path:`settings:${o}`,name:"Settings",settingsType:o},{kind:"settings"}),await n(`✓ Settings tab opened (type: ${o}).`)}async function d(e,a){let{writeOutput:n}=a,{panes:o,globalActiveTab:i}={panes:t.tabState.panes,globalActiveTab:t.tabState.globalActiveTab};await n("=== Open Tabs ===\n");let r=async(e,t=0)=>{let a="  ".repeat(t);if(e.tabs&&e.tabs.length>0)for(let t of(await n(`${a}Pane: ${e.id} (${e.tabs.length} tabs)`),e.tabs)){let e=t.id===i?" [ACTIVE]":"",o=t.isDirty?" [*]":"";await n(`${a}  - [${t.kind}] ${t.name}${o}${e}`),await n(`${a}    id: ${t.id}`),t.path&&await n(`${a}    path: ${t.path}`)}if(e.children)for(let a of e.children)await r(a,t+1)};for(let e of o)await r(e);(0===o.length||o.every(e=>(!e.tabs||0===e.tabs.length)&&!e.children))&&await n("No tabs open.")}class f{commands=new Map;register(e){this.commands.set(e.name,e)}registerAll(e){for(let t of e)this.register(t)}get(e){return this.commands.get(e)}getAll(){return Array.from(this.commands.values())}has(e){return this.commands.has(e)}}let p=new f;async function u(e){let t=p.getAll();for(let a of(await e.writeOutput("=== Pyxis Development Commands ===\n"),await e.writeOutput("Usage: dev <command> [options]\n"),await e.writeOutput("\nAvailable commands:\n"),t))await e.writeOutput(`  ${a.name.padEnd(25)} ${a.description}`);await e.writeOutput("\nFor detailed usage of a command:"),await e.writeOutput("  dev <command> --help\n")}async function g(e,t,a,n){let o={projectName:t,projectId:a,writeOutput:n};if(0===e.length||"help"===e[0]||"--help"===e[0]||"-h"===e[0])return void await u(o);let i=e[0],r=e.slice(1),s=p.get(i);if(!s){await n(`dev: unknown command '${i}'`),await n('Run "dev help" to see available commands.');return}if(r.includes("--help")||r.includes("-h")){await n(`${s.name}: ${s.description}
`),await n(`Usage: ${s.usage}`);return}try{await s.handler(r,o)}catch(e){await n(`dev ${i}: ${e.message}`)}}p.registerAll([{name:"merge-conflict",description:"Create a merge conflict scenario for testing",usage:"dev merge-conflict [file1] [file2] ...",handler:n},{name:"merge-conflict-open",description:"Open merge conflict tab with test data",usage:"dev merge-conflict-open",handler:o},{name:"merge-conflict-complex",description:"Create a complex merge conflict scenario",usage:"dev merge-conflict-complex",handler:i}]),p.registerAll([{name:"tab-diff",description:"Open a diff tab with test data",usage:"dev tab-diff",handler:r},{name:"tab-diff-editable",description:"Open an editable diff tab",usage:"dev tab-diff-editable",handler:s},{name:"tab-diff-multi",description:"Open a multi-file diff tab",usage:"dev tab-diff-multi",handler:l},{name:"tab-welcome",description:"Open the welcome tab",usage:"dev tab-welcome",handler:c},{name:"tab-settings",description:"Open settings tab",usage:"dev tab-settings [type]",handler:m},{name:"tab-list",description:"List all open tabs",usage:"dev tab-list",handler:d}]),e.s([],157937),e.i(157937),e.s(["devCommandRegistry",0,p,"handleDevCommand",()=>g],248858)}]);