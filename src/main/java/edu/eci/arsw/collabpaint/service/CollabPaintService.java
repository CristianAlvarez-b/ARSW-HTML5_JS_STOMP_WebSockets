package edu.eci.arsw.collabpaint.service;

import edu.eci.arsw.collabpaint.exception.CollabPointException;
import edu.eci.arsw.collabpaint.model.Point;
import edu.eci.arsw.collabpaint.model.Polygon;
import edu.eci.arsw.collabpaint.repository.CollabPaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CollabPaintService {
    private int polygonSize = 4;
    @Autowired
    private CollabPaintRepository repository;
    public void addPoint(Integer key, Point p) throws CollabPointException {
        ArrayList<Point> points = repository.addPoint(key, p);

        if(points.size()>=polygonSize){
            Polygon polygon = new Polygon(points);
            System.out.println("Asi se manda antes:"+polygon);
            repository.clearArray(key);
            System.out.println("Asi se manda despues:"+polygon);
            throw new CollabPointException("New Polygon", polygon);
        }
    }
}
