import Profiles from '../../models/profile.model.js';

export function getProfiles(){
    const profileList = Profiles.get();
    return profileList.filter((profile) => profile.role !== 'admin' && profile.id !== -1);
}

export function getProfileById(id){
    return Profiles.getById(id);
}

export function deleteProfile(id){
    Profiles.delete(id);
}

export function profileManager(profile){
    return Profiles.create(profile)
}

export function updateProfile(profileId , updatedData ){
    return Profiles.update(profileId, updatedData);
}

export function createProfile(data){
    return Profiles.create(data, true);
}
