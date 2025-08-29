import React from 'react'
import { Link } from 'react-router';
import {
  PlusCircleIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  FolderOpenIcon,
} from "@heroicons/react/24/outline"; // heroicons

import { useMonaco } from '@monaco-editor/react';
import useTabStore from '../stores/tab.store';
import { usePanelStore } from '../stores/panels.store';

function Welcome({panelId}) {
  const _panelId = Number.isInteger(panelId) ? panelId : 1;
  const parentPageUrl = Number.isInteger(panelId) ? `/panels/${panelId}`: '';

  const monaco = useMonaco();
  const addTab = useTabStore(state => state.addTab);
  const addTabIndexToPanel = usePanelStore(state => state.addTabIndexToPanel);
  
  const actions = [
    {
      label: "New Tab",
      to: `/panels/${_panelId}/tabs/new`,
      icon: <PlusCircleIcon className="w-5 h-5" />,
      color: "bg-blue-600 text-white hover:bg-blue-700",
      onClick: () => {
        const newTabIndex = addTab(monaco, "json")
      }
    },
    {
      label: "Open Folder",
      to: `/panel/${_panelId}/tab/open`,
      icon: <FolderOpenIcon className="w-5 h-5" />,
      color: "dark:bg-slate-800 bg-zinc-300 dark:text-gray-50 text-gray-800 hover:bg-zinc-200 hover:dark:bg-slate-700",
    },
    {
      label: "Settings",
      to: `${parentPageUrl}/settings`,
      icon: <Cog6ToothIcon className="w-5 h-5" />,
      color: "dark:bg-slate-800 bg-zinc-300 dark:text-gray-50 text-gray-800 hover:bg-zinc-200 hover:dark:bg-slate-700",
    },
    {
      label: "Help",
      to: `${parentPageUrl}/docs`,
      icon: <QuestionMarkCircleIcon className="w-5 h-5" />,
      color: "dark:bg-slate-800 bg-zinc-300 dark:text-gray-50 text-gray-800 hover:bg-zinc-200 hover:dark:bg-slate-700",
    },
  ];

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-400 mb-2">
        Welcome
      </h1>
      <p className="text-gray-500 mb-6">
        Get started by creating a new tab or opening a workspace
      </p>

      <div className="flex flex-col gap-3 w-64">
        {actions.map((action) => (
          <Link
            key={action.label}
            to={action.to}
            className={`flex items-center gap-3 px-4 py-2 rounded-md font-medium transition ${action.color}`}
          >
            {action.icon}
            <span>{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Welcome