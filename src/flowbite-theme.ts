import { CustomFlowbiteTheme } from "flowbite-react";


export const customTheme: CustomFlowbiteTheme = {
  button: {
    color: {
      primary: "bg-blue-500 hover:bg-red-600 text-white",
    },
  },
  badge: {
    "root": {
      "color": {
        "dark_transparent_badge": "bg-[rgba(0,0,0,.5)] text-white",
      }
    }
  },
  dropdown: {
    "arrowIcon": "ml-2 h-4 w-4",
    "content": "py-1 focus:outline-none",
    "floating": {
      "animation": "transition-opacity",
      "arrow": {
        "base": "absolute z-10 h-2 w-2 rotate-45",
        "style": {
          "dark": "bg-gray-900 dark:bg-gray-700",
          "light": "bg-white",
          "auto": "bg-white dark:bg-gray-700"
        },
        "placement": "-4px"
      },
      "base": "z-10 w-fit divide-y divide-gray-100 rounded shadow focus:outline-none",
      "content": "py-1 text-sm text-gray-700 dark:text-gray-200",
      "divider": "my-1 h-px bg-gray-100 dark:bg-gray-600",
      "header": "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200",
      "hidden": "invisible opacity-0",
      "item": {
        "container": "",
        "base": "flex w-full cursor-pointer items-center justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white",
        "icon": "mr-2 h-4 w-4"
      },
      "style": {
        "dark": "bg-gray-900 text-white dark:bg-gray-700",
        "light": "border border-gray-200 bg-white text-gray-900",
        "auto": "border border-gray-200 bg-white text-gray-900 dark:border-none dark:bg-gray-700 dark:text-white"
      },
      "target": "w-fit"
    },
    "inlineWrapper": "flex items-center"
  },
  sidebar: {
    "root": {
      "base": "h-full",
      "collapsed": {
        "on": "w-16",
        "off": "w-full"
      },
      // "inner": "fixed top-0 bottom-0 left-0 right-0 w-3/2 sm:w-full bg-red z-10 sm:relative | h-full overflow-y-auto overflow-x-hidden rounded bg-white-50 px-1 py-4 bg-white dark:bg-gray-800"
      "inner": "w-full bg-red z-10 sm:relative | h-full overflow-y-auto overflow-x-hidden px-1 py-4 bg-white dark:bg-gray-800"
    },
    "collapse": {
      "button": "group flex w-full items-center rounded-lg p-2 text-base font-normal text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
      "icon": {
        "base": "h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
        "open": {
          "off": "",
          "on": "text-gray-900"
        }
      },
      "label": {
        "base": "ml-3 flex-1 whitespace-nowrap text-left",
        "icon": {
          "base": "h-6 w-6 transition delay-0 ease-in-out",
          "open": {
            "on": "rotate-180",
            "off": ""
          }
        }
      },
      "list": "space-y-2 py-2"
    },
    "cta": {
      "base": "mt-6 rounded-lg bg-gray-100 p-4 dark:bg-gray-700",
      "color": {
        "ibro": "bg-red-400",
        "blue": "bg-cyan-50 dark:bg-cyan-900",
        "dark": "bg-dark-50 dark:bg-dark-900",
        "failure": "bg-red-50 dark:bg-red-900",
        "gray": "bg-alternative-50 dark:bg-alternative-900",
        "green": "bg-green-50 dark:bg-green-900",
        "light": "bg-light-50 dark:bg-light-900",
        "red": "bg-red-50 dark:bg-red-900",
        "purple": "bg-purple-50 dark:bg-purple-900",
        "success": "bg-green-50 dark:bg-green-900",
        "yellow": "bg-yellow-50 dark:bg-yellow-900",
        "warning": "bg-yellow-50 dark:bg-yellow-900"
      }
    },
    "item": {
      "base": "flex items-center justify-center rounded-e-full p-2 text-base font-normal text-gray-900 hover:bg-primary-50 dark:text-white dark:hover:bg-gray-700",
      "active": "bg-gray-100 dark:bg-gray-700",
      "collapsed": {
        "insideCollapse": "group w-full pl-8 transition duration-75",
        "noIcon": "font-bold"
      },
      "content": {
        "base": "flex-1 whitespace-nowrap px-3"
      },
      "icon": {
        "base": "h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
        "active": "text-gray-700 dark:text-gray-100"
      },
      "label": "",
      "listItem": ""
    },
    "items": {
      "base": ""
    },
    "itemGroup": {
      "base": "mt-4 space-y-2 border-t border-gray-200 pt-4 first:mt-0 first:border-t-0 first:pt-0 dark:border-gray-700"
    },
    "logo": {
      "base": "mb-5 flex items-center pl-2.5",
      "collapsed": {
        "on": "hidden",
        "off": "self-center whitespace-nowrap text-xl font-semibold dark:text-white"
      },
      "img": "mr-3 h-6 sm:h-7"
    }
  },
  table: {
    "root": {
      "base": "w-full text-left text-sm text-gray-500 dark:text-gray-400",
      "shadow": "absolute left-0 top-0 -z-10 h-full w-full rounded-lg bg-white sm:drop-shadow-md dark:bg-black",
      "wrapper": "relative z-0"
    },
    "body": {
      "base": "group/body text-sm",
      "cell": {
        "base": "px-6 py-4 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg"
      }
    },
    "head": {
      "base": "group/head text-sm capitalize text-gray-700 dark:text-gray-400",
      "cell": {
        "base": "bg-gray-50 px-6 py-3 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg dark:bg-gray-700"
      }
    },
    "row": {
      "base": "group/row",
      "hovered": "hover:bg-gray-50 dark:hover:bg-gray-600",
      "striped": "odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700"
    }
  },
  tabs: {
    "base": "flex flex-col gap-2",
    "tablist": {
      "base": "flex text-center overflow-auto remove-scrollbar",
      "styles": {
        "default": "flex-wrap border-b border-gray-200 dark:border-gray-700",
        "underline": "-mb-px flex-nowrap border-b border-gray-200 dark:border-gray-700 text-[#7B828E]",
        "pills": "flex-wrap space-x-2 text-sm font-medium text-gray-500 dark:text-gray-400",
        "fullWidth": "grid w-full grid-flow-col divide-x divide-gray-200 rounded-none text-sm font-medium shadow dark:divide-gray-700 dark:text-gray-400"
      },
      "tabitem": {
        "base": "whitespace-nowrap flex items-center justify-center rounded-t-lg p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",
        "styles": {
          "default": {
            "base": "rounded-t-lg",
            "active": {
              "on": "bg-gray-100 text-cyan-600 dark:bg-gray-800 dark:text-cyan-500 font-bold",
              "off": "text-gray-500 hover:bg-gray-50 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-800  dark:hover:text-gray-300"
            }
          },
          "underline": {
            "base": "rounded-t-lg",
            "active": {
              "on": "active rounded-t-lg border-b-2 border-cyan-600 text-cyan-600 dark:border-cyan-500 dark:text-cyan-500",
              "off": "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            }
          },
          "pills": {
            "base": "",
            "active": {
              "on": "rounded-lg bg-cyan-600 text-white",
              "off": "rounded-lg hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
            }
          },
          "fullWidth": {
            "base": "ml-0 flex w-full rounded-none first:ml-0",
            "active": {
              "on": "active rounded-none bg-gray-100 p-4 text-gray-900 dark:bg-gray-700 dark:text-white",
              "off": "rounded-none bg-white hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
            }
          }
        },
        "icon": "mr-2 h-5 w-5"
      }
    },
    "tabitemcontainer": {
      "base": "",
      "styles": {
        "default": "",
        "underline": "",
        "pills": "",
        "fullWidth": ""
      }
    },
    "tabpanel": "py-3"
  }

};