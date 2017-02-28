package com.motiondetection.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.support.ByteArrayMultipartFileEditor;

import com.motiondetection.enumaration.UploadStatus;
import com.motiondetection.service.MotionDetectionService;
import com.motiondetection.service.dto.StoredImagesDto;

/**
 * Controller for home page.
 */
@Controller
@RequestMapping("/home")
public class HomeController {

    private static final String HOME_VIEW_NAME = "home";

    @Autowired
    private MotionDetectionService motionDetectionService;

    @InitBinder
    protected void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(byte[].class, new ByteArrayMultipartFileEditor());
    }

    @RequestMapping(method = RequestMethod.GET)
    public String home() {
        return HOME_VIEW_NAME;
    }

    @RequestMapping(value="/upload", method = RequestMethod.POST)
    @ResponseBody
    public UploadStatus uploadImage(@RequestParam(name= "image") MultipartFile file) {
        return motionDetectionService.storeImage(file);
    }

    @RequestMapping(value = "/getImages", method = RequestMethod.GET)
    @ResponseBody
    public StoredImagesDto getImages() {

        StoredImagesDto storedImages = motionDetectionService.getStoredImages();

        return storedImages;
    }
}
