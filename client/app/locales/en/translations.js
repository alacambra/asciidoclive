/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                           Copyright 2016 Chuan Ji                         *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export default {
  titleSuffix: ' - AsciiDocLIVE',
  header: {
    open: 'Open',
    openHeader: 'Open from',
    save: 'Save',
    saveHeader: 'Save',
    saveAsHeader: 'Save as new file',
    settings: 'Settings',
    saving: 'Saving...',
    saved: 'Saved',
    saveError: 'Could not save document'
  },
  defaultTitle: 'Untitled Document',
  defaultBody: 'blah blah',
  storageTypePrefix: {
    dropbox: '[Dropbox] ',
    'google-drive': '[Google Drive] '
  },
  storageType: {
    dropbox: 'Dropbox',
    'google-drive': 'Google Drive'
  },
  edit: {
    reopen: {
      title: 'Open from {{storageType}}',
      prompt: 'Would you like to open the newly saved file from ' +
        '{{storageType}}?',
      ok: 'Open from {{storageType}}',
      cancel: 'Cancel'
    }
  }
};
