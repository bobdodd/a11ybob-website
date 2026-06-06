/* Class OsmId */

class OsmId {

    static declaredIds = []

    static add(id, subjectMatter) {

        if (OsmId.declaredIds[id] === undefined) {
            OsmId.declaredIds[id] = [];
        }

        if (!OsmId.declaredIds[id].includes(subjectMatter)) {
            OsmId.declaredIds[id].push(subjectMatter);
        }
    }

}
