package edu.eci.arsw.collabpaint.exception;

import edu.eci.arsw.collabpaint.model.Polygon;

public class CollabPointException extends Exception{
    private Polygon polygon;
    public CollabPointException(String message, Polygon polygon) {
        super(message);
        this.polygon = polygon;
    }
    public Polygon getPolygon() {
        return polygon;
    }
}
