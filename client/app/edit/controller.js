/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                           Copyright 2016 Chuan Ji                         *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import Ember from 'ember';

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  storageProviders: Ember.inject.service(),

  isFirstTitleChange: true,
  debounceTitleChangeMs: 2000,

  showSavingStatus: false,
  showSavedStatus: false,
  showSaveErrorStatus: false,
  showRenamingStatus: false,
  showRenamedStatus: false,
  showRenameErrorStatus: false,
  reopenStorageType: null,
  reopenStorageTypeTranslation: null,

  actions: {
    open(storageType) {
      console.log('Opening from %o', storageType);
      this.get('storageProviders').open(storageType)
      .then(function(storageSpec) {
        this.transitionToRoute(
          'edit',
          storageSpec.get('storageType'),
          storageSpec.get('storagePath'));
      }.bind(this), function(error) {
        console.error('Open error: %o', error);
      });
    },
    openRecent(recentFile) {
      console.log('Opening recent file: %o', recentFile);
      this.transitionToRoute(
        'edit',
        recentFile.storage_type,
        recentFile.storage_path);
    },
    save() {
      this.set('showSavedStatus', false);
      this.set('showSaveErrorStatus', false);
      this.set('showSavingStatus', true);
      this.get('storageProviders').save(this.get('model')).then(function() {
        this.set('showSavingStatus', false);
        this.set('showSavedStatus', true);
      }.bind(this), function(error) {
        console.error('Save error: %o', error);
        this.set('showSavingStatus', false);
        this.set('showSaveErrorStatus', true);
      }.bind(this));
    },
    saveAs(storageType) {
      this.set('showSavedStatus', false);
      this.set('showSaveErrorStatus', false);
      this.set('showSavingStatus', true);
      this.get('storageProviders').saveAs(this.get('model'), storageType)
      .then(function(storageSpec) {
        this.set('showSavingStatus', false);
        this.set('showSavedStatus', true);
        if (Ember.isNone(storageSpec)) {
          this.set('reopenStorageType', storageType);
          this.set(
            'reopenStorageTypeTranslation',
            this.get('i18n').t('storageType.' + storageType));
          Ember.$('#reopen-dialog').modal('show');
        } else {
          this.transitionToRoute(
            'edit',
            storageSpec.get('storageType'),
            storageSpec.get('storagePath'));
        }
      }.bind(this), function(error) {
        console.error('Save error: %o', error);
        this.set('showSavingStatus', false);
        this.set('showSaveErrorStatus', true);
      }.bind(this));
    },
    reopen(storageType) {
      Ember.$('#reopen-dialog').modal('hide');
      this.send('open', storageType.toString());
    },
  },
  debounceTitleChange: Ember.observer('model.title', function() {
    if (this.get('isFirstTitleChange')) {
      this.set('isFirstTitleChange', false);
      return;
    }
    this.get('target').send('collectTitleTokens', []);
    Ember.run.debounce(
      this, this.onTitleChanged, this.get('debounceTitleChangeMs'));
  }),
  onTitleChanged() {
    this.set('showRenamedStatus', false);
    this.set('showRenameErrorStatus', false);
    this.set('showRenamingStatus', true);
    this.get('storageProviders').rename(this.get('model'))
    .then(function(storageSpec) {
      this.set('showRenamingStatus', false);
      if (!Ember.isNone(storageSpec)) {
        this.set('showRenamedStatus', true);
        this.transitionToRoute(
          'edit',
          storageSpec.get('storageType'),
          storageSpec.get('storagePath'));
      }
    }.bind(this), function(error) {
      console.error('Rename error: %o', error);
      this.set('showRenamingStatus', false);
      this.set('showRenameErrorStatus', true);
    }.bind(this));
  },
  onHasDirtyAttributesChanged: Ember.observer(
    'model.hasDirtyAttributes', function() {
      this.get('target').send('collectTitleTokens', []);
    })
});
