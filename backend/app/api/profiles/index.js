const { Router } = require('express')
const router = new Router()
const profileManager = require('./manager')

router.get('/', (req, res) => {
    try {
        res.status(200).json(profileManager.getProfiles())
    } catch (err) {
        res.status(500).json(err)
        console.log(err)
    }   
})

router.get('/:id', (req, res) => {
    try {
        const profile = profileManager.getProfileById(req.params.id);
        res.status(200).json(profile)
    } catch (err) { console.log(err); }
})

router.delete('/:id', (req, res) => {
    try {
        const profileId = parseInt(req.params.id);
        console.log(`Requête de suppression du profil id=${profileId} reçue`);
        
        try {
            //On vérifie si le profile existe vraiment pour renvoyer l'erreur adaptée
            profileManager.getProfileById(profileId);
        } catch (error) {
            return res.status(404).json({ error: `Profil avec l'id ${profileId} non trouvé` });
        }
        
        profileManager.deleteProfile(profileId);
        console.log(`Profil avec id=${profileId} supprimé`);
        
        res.status(200).json({ success: true, message: `Profil avec l'id ${profileId} supprimé` });
    } catch (err) {
        res.status(500).json(err)
        console.log('Erreur lors de la suppression du profil:', err)
    }
})

router.post('/', (req, res) => {
    try {
        console.log('Requête de création de profil reçue:', req.body);
        
        if (!req.body.name || !req.body.lastName) {
            return res.status(400).json({ error: 'Les champs nom et prénom sont obligatoires' });
        }
        
        const newProfile = profileManager.createProfile(req.body);
        console.log('Profil créé avec succès:', newProfile);
        profileManager.getProfiles();
        res.status(201).json(newProfile);
    } catch (err) {
        res.status(500).json(err)
        console.log('Erreur lors de la création du profil:', err)
    }
})


router.put('/:id', (req, res) => {
    try {
        const profileId = parseInt(req.params.id);
        
        console.log(`Requête de mise à jour du profil id=${profileId} reçue`);
        console.log('Données reçues:', req.body);
        
        try {
            profileManager.getProfileById(profileId);
        } catch (error) {
            console.error(`Profil avec id=${profileId} non trouvé`);
            return res.status(404).json({ error: `Profil avec l'id ${profileId} non trouvé` });
        }
        
        const updatedProfile = profileManager.updateProfile(profileId, { ...req.body, id: profileId });
        
        console.log('Profil mis à jour avec succès:', updatedProfile);
        
        res.status(200).json(updatedProfile);
    } catch (err) {
        console.error('Erreur lors de la mise à jour du profil:', err);
        res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du profil', details: err.message });
    }
});


module.exports = router