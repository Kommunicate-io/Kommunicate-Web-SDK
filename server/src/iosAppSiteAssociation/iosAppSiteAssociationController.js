exports.getIosSiteAssociationSettings = (req, res) => {
    return res.status(200).json(
        {
            applinks: {
                apps: [],
                details: [
                    {
                        appID: "C25JNDCBM4.io.kommunicate.agent",
                        paths: ["/conversations/*"]
                    }
                ]
            }
        }
    );


}