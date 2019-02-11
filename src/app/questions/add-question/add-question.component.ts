import { Component, OnInit, Output, EventEmitter, SystemJsNgModuleLoader } from '@angular/core'
import { Result } from '../../model/Result'
import { QuestionWrapper } from '../../model/questionWrapper'
import { HTTPService } from '../../service/http.service'
import { Category } from '../../model/category'


@Component({
    selector: 'add-question',
    templateUrl: 'add-question.component.html'
})

export class AddQuestionComponent implements OnInit {
    selectedCategory: string;
    result: Result;
    categories: Category[];
    @Output() addedQuestion = new EventEmitter();

    constructor(private httpService: HTTPService) {
        this.result = new Result();

        this.httpService.getAllCategories().then((data) => {
            this.categories = data;
            // console.log(this.categories);
        }).catch((err) => {
            this.result.updateError("Error!");
        });

    }

    ngOnInit() { }

    addQuestion(text, imageurl, category, choice, correctchoice) {
        // console.log(text,imageurl);
        this.result.updateInfo("Adding question...");
        var questionWrapper = new QuestionWrapper();
        questionWrapper.Text = text.trim();
        questionWrapper.setChoices(choice.split(";").map((item) => item.trim()));// = ;
        questionWrapper.CategoryName = this.selectedCategory;
        questionWrapper.ImageUrl = imageurl;
        var el = questionWrapper.choice.find((el) => el.Text == correctchoice);
        if (el) {
            questionWrapper.correctChoice = questionWrapper.choice.find((el) => el.Text == correctchoice);
            questionWrapper.correctChoiceText = correctchoice;
            console.log(questionWrapper)
            this.httpService.addQuestionWrapper(questionWrapper).then((res) => {
                this.addedQuestion.emit("true");
                this.result.updateTextSuccess("Added Question: " + questionWrapper.Text);
            }).catch((err) => alert(err))
        }
        else
            this.result.updateError("Correct option not found the choices. Please ensure to use correct choice from the choices you wrote.");
    }

    addUpdateQuestion() {
        // throw "error";

        var bigtext = `A software app that provides a service to other computer systems connected to the same network[;]Server;Client;[;]Server
        A software app that requests a service from a server connected to the same network[;]Server;Client;[;]Client
        What is Client in a Client - Server Architecture?[;]A software app that requests a service from a server connected to the same network;A software app that provides a service to other computer systems connected to the same network;[;]A software app that requests a service from a server connected to the same network
        What is Server in a Client - Server Architecture?[;]A software app that requests a service from a server connected to the same network;A software app that provides a service to other computer systems connected to the same network;[;]A software app that provides a service to other computer systems connected to the same network
        Connection point for devices on a single network(via Ethernet or wireless)[;]Hub;Switch;Router;[;]Hub
        Same thing as a hub but can identify which device is connected to which port[;]Hub;Switch;Router;[;]Switch
        Used to join multiple networks and serve as an intermediary between networks[;]Hub;Switch;Router;[;]Router
        What is a Router?[;]Connection point for devices on a single network(via Ethernet or wireless);Same thing as a hub but can identify which device is connected to which port;Used to join multiple networks and serve as an intermediary between networks;[;]Used to join multiple networks and serve as an intermediary between networks
        What is a Hub?[;]Connection point for devices on a single network(via Ethernet or wireless);Same thing as a hub but can identify which device is connected to which port;Used to join multiple networks and serve as an intermediary between networks;[;]Connection point for devices on a single network(via Ethernet or wireless)
        What is a Switch?[;]Connection point for devices on a single network(via Ethernet or wireless);Same thing as a hub but can identify which device is connected to which port;Used to join multiple networks and serve as an intermediary between networks;[;]Same thing as a hub but can identify which device is connected to which port
        A global WAN connecting millions of computer of computer systems[;]Internet; Intranet; Extranet;[;]Internet
        Computer network that uses the internet to allow controlled access by specific users to a specific LAN or WAN(require authorisation and anyone with the correct authorisation can connect)[;]Internet; Intranet; Extranet;[;]Extranet
        A private network with internet with internet protected by a firewall(no one without registration of the network can't access)[;]Internet; Intranet; Extranet;[;] Intranet
        Computers are clients and servers at the same time[;]P2P;Client-Server;[;]P2P
        What is P2P?[;]Peer to Peer;People to People;Person to Person;[;]Peer to Peer
        Provides abstraction functions for apps to use (Example: http, https, SMTP, POP3 etc.) Which OSI layer is?[;]Application;Presentation;Session;[;] Application
        Ensures the received data s in the correct format for the specific OS (Example: ASCII to UniCode, Big Endian Library, Little Endian Library) Which OSI layer is?[;]Application;Presentation;Session;[;] Presentation
        Sets up and manages sessions ('conversations') between network nodes/users Which OSI layer is?[;]Application;Presentation;Session;[;] Session
        Breaks data into packets and handles their delivery and also performs error checking Which OSI layer is?[;]Transport;Network;Data Link;[;] Transport
        Handles addressing of network nodes/users(by IP) and the routing data between them Which OSI layer is?[;]Transport;Network;Data Link;[;] Network
        Actually sends the packets between each node/user?[;]Transport;Network;Data Link;[;] Data Link
        Computer data is translated into physical signals (light pulse, electrical signals etc.). In other words, it is the actually physical connection between them Which layer is this?[;]Transport;Network;Physical;[;] Physical
        Portion of data that is transmitted through a network (contains checksum, parity bit, destination address etc.) ?[;]Data Packet;Protocol;VPN;[;]Data Packet
        Checksum mechanisms provide...?[;]Data Integrity;Source Integrity;[;]Data Integrity
        ________ happens when the request on the network resources exceeds the offered capacity[;]Congestion;Deadlock;[;]Congestion
        When two or more networks are waiting for each other to finish a task and neither ever does in the end. Is called?[;]Congestion;Deadlock;[;] Deadlock
        Slowest segment in a network is called?[;]Bottleneck;Throughput;Goodput;[;] Bottleneck
        Actual transfer rate is called?[;]Bottleneck;Throughput;Goodput;[;] Throughput
        Transfer rate of useful data?[;]Bottleneck;Throughput;Goodput;[;] Goodput
        What is data compression?[;]Reduces the size of files to be transmitted over a network;Increases the size of files to be transmitted over a network;[;]Reduces the size of files to be transmitted over a network
        What is the full-form DHCP?[;]Dynamic Host Configuration Protocol;Dynamic Host Configuration Preparation;[;]Dynamic Host Configuration Protocol
        What is the full-form SSID?[;]Service Set Identification;Service Software Identification;[;]Service Set Identification`;

        try {
            this.selectedCategory = "Computer Networks"
            if (!this.selectedCategory || this.selectedCategory == "") throw "Category Cannot be null or empty"
            console.log(this.selectedCategory)
            var textarray = bigtext.split('\n');
            console.log(textarray.length)
            var promises = [];
            var questionwappers = [];
            textarray.forEach(ele => {
                console.log(ele);
                var element = ele.split('[;]');
                if (element.length == 3) {
                    var text = element[0].trim();
                    var choice = element[1];
                    var correctchoice = element[2].trim();
                    //this.addQuestion(element[0],null,'Computer',element[1],element[2]);
                    var questionWrapper = new QuestionWrapper();
                    questionWrapper.Text = text.trim();
                    questionWrapper.setChoices(choice.split(";").map((item) => item.trim()));// = ;
                    questionWrapper.CategoryName = this.selectedCategory;
                    questionWrapper.ImageUrl = null;
                    var el = questionWrapper.choice.find((el) => el.Text == correctchoice);
                    if (el) {
                        questionWrapper.correctChoice = questionWrapper.choice.find((el) => el.Text == correctchoice);
                        questionWrapper.correctChoiceText = correctchoice;
                        questionwappers.push(questionWrapper);
                    }
                    else {
                        throw "The option does not seem to match correct option"
                    }
                }
            });

            console.log(questionwappers.length);
            console.log(questionwappers);

            questionwappers.forEach((el) => {
                promises.push(this.httpService.addQuestionWrapper(el));
            })

            Promise.all(promises).then((res) => {
                this.result.updateTextSuccess("All went okay!");
            })
        } catch (error) {
            this.result.updateError(error);
        }
    }

    updateResult(updatedResult: Result) {
        this.result = updatedResult;
    }
}