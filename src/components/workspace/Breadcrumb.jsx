import React, { useState } from 'react';
import * as monaco from 'monaco-editor';
import { Link } from 'react-router';
import clsx from "clsx";
import { ChevronRightIcon } from '@heroicons/react/24/solid';

import { useWorkspaceStore } from '../stores/workspace.store';
import { getJsonSiblings } from '../../utils/quickParsers';

import SiblingDropdown from './SiblingDropdown';

function Breadcrumb({ title, path }) {
  const breadcrumb = useWorkspaceStore(
    (state) => state.breadcrumbs[path]
  ) ?? [];

  function showSiblingDropdown(editor, siblings) {
    console.log(editor, siblings)
  }

  return (<div
    className={clsx("w-full h-5 p-1 text-xs flex gap-2 select-none monaco-component",
      "bg-[var(--vscode-editor-background)] text-[var(--vscode-editor-foreground)]"
    )}
  >
    <div
      className='w-fit ml-4'
    >
      <a href='#'>{title}</a>
    </div>
    {breadcrumb.map((item, index) => (
      <div
        key={`breadcrumb-item-${index + 1}`}
        className='w-fit flex gap-2'
      >
        <ChevronRightIcon className='h-4 w-4' />
        <a
          href='javascript:void(0)'
          onClick={(e) => {
            e.preventDefault();
            const editor = useWorkspaceStore.getState().getEditor(path);
            if (!editor) {
              console.warn('editor not found')
            } else {
              const siblings = getJsonSiblings(item.node);
              showSiblingDropdown(editor, siblings);
            }
          }}
        >
          {item.label}
        </a>
      </div>
    ))}
  </div>)
}


export default Breadcrumb;