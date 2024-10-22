package edu.eci.arsw.collabpaint.controller;


import edu.eci.arsw.collabpaint.exception.CollabPointException;
import edu.eci.arsw.collabpaint.model.Point;
import edu.eci.arsw.collabpaint.service.CollabPaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class STOMPMessagesHandler {
    @Autowired
    CollabPaintService service;
    @Autowired
    SimpMessagingTemplate msgt;

    @MessageMapping("/newpoint.{numdibujo}")
    public void handlePointEvent(Point pt, @DestinationVariable String numdibujo) throws Exception {
        System.out.println("Nuevo punto recibido en el servidor!:"+pt);
        msgt.convertAndSend("/topic/newpoint."+numdibujo, pt);
        try {
            service.addPoint(Integer.parseInt(numdibujo), pt);
        }catch (CollabPointException e){
            System.out.println("Nuevo Poligono en el servidor!:"+e.getPolygon().toString());
            msgt.convertAndSend("/topic/newpolygon."+numdibujo, e.getPolygon());
        }
    }
}
