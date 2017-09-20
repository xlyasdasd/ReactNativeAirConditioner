import Storage from 'react-native-storage';
import React from 'react';
import {AsyncStorage} from 'react-native';

var storage = new Storage({
	// maximum capacity, default 1000
	size: 1000,

	// Use AsyncStorage for RN, or window.localStorage for web.
	// If not set, data would be lost after reload.
	storageBackend: AsyncStorage,

	// expire time, default 1 day(1000 * 3600 * 24 milliseconds).
	// can be null, which means never expire.
	defaultExpires: 1000 * 3600 * 24,

	// cache data in the memory. default is true.
	enableCache: true,

	// if data was not found in storage or expired,
	// the corresponding sync method will be invoked and return
	// the latest data.
	sync : {
		// we'll talk about the details later.
	}
})

export function saveUser(user){
	storage.save({
	key: 'User',   // Note: Do not use underscore("_") in key!
	data:user,
	// if not specified, the defaultExpires will be applied instead.
	// if set to null, then it will never expire.
	expires: 1000 * 3600
});
}
export function saveInstance(key,user){
	storage.save({
	key: key,   // Note: Do not use underscore("_") in key!
	data:user,
	// if not specified, the defaultExpires will be applied instead.
	// if set to null, then it will never expire.
	expires: 1000 * 3600
});
}

export function getInstance(key){
	// load
 return promis = storage.load({
	key: key,

	// autoSync(default true) means if data not found or expired,
	// then invoke the corresponding sync method
	autoSync: true,

	// syncInBackground(default true) means if data expired,
	// return the outdated data first while invoke the sync method.
	// It can be set to false to always return data provided by sync method when expired.(Of course it's slower)
	syncInBackground: true,

	// you can pass extra params to sync method
	// see sync example below for example
	syncParams: {
		extraFetchOptions: {
			// blahblah
		},
		someFlag: true,
	},
});
}

export function getUser(){
	// load
 return promis = storage.load({
	key: 'User',

	// autoSync(default true) means if data not found or expired,
	// then invoke the corresponding sync method
	autoSync: true,

	// syncInBackground(default true) means if data expired,
	// return the outdated data first while invoke the sync method.
	// It can be set to false to always return data provided by sync method when expired.(Of course it's slower)
	syncInBackground: true,

	// you can pass extra params to sync method
	// see sync example below for example
	syncParams: {
	  extraFetchOptions: {
	    // blahblah
	  },
	  someFlag: true,
	},
});


//
// return promis



}
